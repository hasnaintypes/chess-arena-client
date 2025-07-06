"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Users,
  History,
  Smile,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGameStore } from "@/stores/game-store";
import { useChatStore } from "@/stores/chat-store";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: "message" | "system" | "move";
  avatar?: string;
  rating?: number;
}

interface GameMove {
  id: string;
  moveNumber: number;
  white?: {
    san: string;
    timestamp: Date;
  };
  black?: {
    san: string;
    timestamp: Date;
  };
}

interface EnhancedChatPanelProps {
  roomId: string;
}

export function EnhancedChatPanel({ roomId }: EnhancedChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get game data from store
  const { currentGame } = useGameStore();
  const { messages, sendMessage, joinGameChat, leaveGameChat } = useChatStore();

  // Join chat when component mounts
  useEffect(() => {
    if (currentGame?.id) {
      joinGameChat(currentGame.id);
    }
    return () => {
      if (currentGame?.id) {
        leaveGameChat();
      }
    };
  }, [currentGame?.id, joinGameChat, leaveGameChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Convert game moves to display format
  const gameMovesForDisplay = React.useMemo(() => {
    if (!currentGame?.moves) {
      console.log("❌ No moves found in currentGame");
      return [];
    }

    console.log("🎯 Processing moves:", currentGame.moves);
    
    const moves: GameMove[] = [];
    
    // Group moves by moveNumber since your DB stores them individually
    const movesByNumber: { [key: number]: GameMove } = {};
    
    currentGame.moves.forEach((move, index) => {
      console.log(`📝 Processing move ${index}:`, move);
      
      const moveNumber = move.moveNumber;
      
      if (!movesByNumber[moveNumber]) {
        movesByNumber[moveNumber] = {
          id: `move-${moveNumber}`,
          moveNumber: moveNumber,
        };
      }
      
      // Check if this move has white or black data
      if (move.white) {
        movesByNumber[moveNumber].white = {
          san: move.white.san,
          timestamp: new Date(move.white.timestamp),
        };
      }
      
      if (move.black) {
        movesByNumber[moveNumber].black = {
          san: move.black.san,
          timestamp: new Date(move.black.timestamp),
        };
      }
    });
    
    // Convert to array and sort by move number
    const movesArray = Object.values(movesByNumber).sort((a, b) => a.moveNumber - b.moveNumber);
    
    console.log("✅ Processed moves for display:", movesArray);
    return movesArray;
  }, [currentGame?.moves]);

  // Format moves for display (like "1. e4 e5")
  const formatMoveForDisplay = (move: GameMove) => {
    if (move.white && move.black) {
      return `${move.moveNumber}. ${move.white.san} ${move.black.san}`;
    } else if (move.white) {
      return `${move.moveNumber}. ${move.white.san}`;
    } else if (move.black) {
      return `${move.moveNumber}... ${move.black.san}`;
    }
    return `${move.moveNumber}. --`;
  };

  // Get the latest timestamp for a move
  const getMoveTimestamp = (move: GameMove) => {
    if (move.black?.timestamp) return move.black.timestamp;
    if (move.white?.timestamp) return move.white.timestamp;
    return new Date();
  };

  // Get actual spectators (exclude the two players)
  const actualSpectators = React.useMemo(() => {
    if (!currentGame?.spectators) return [];

    return currentGame.spectators.filter(
      (spectator) =>
        spectator.userId !== currentGame.players.white.userId &&
        spectator.userId !== currentGame.players.black.userId
    );
  }, [currentGame?.spectators, currentGame?.players]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentGame?.id) return;

    try {
      await sendMessage(currentGame.id, newMessage);
      setNewMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getMessageTypeColor = (type: ChatMessage["type"]) => {
    switch (type) {
      case "system":
        return "text-yellow-400";
      case "move":
        return "text-blue-400";
      case "message":
        return "text-white";
      default:
        return "text-white";
    }
  };

  // Add this helper function inside the component (before the return statement):
  const isSpecialMessage = (
    type: ChatMessage["type"]
  ): type is "system" | "move" => {
    return type === "system" || type === "move";
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1c2620] border border-[#29382f]">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
          >
            <Users className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="moves"
            className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
          >
            <History className="h-4 w-4 mr-2" />
            Moves
          </TabsTrigger>
          <TabsTrigger
            value="spectators"
            className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
          >
            <Users className="h-4 w-4 mr-2" />
            Viewers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          <div className="bg-[#1c2620] rounded-lg">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#29382f]">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">Game Chat</h3>
                <Badge
                  variant="outline"
                  className="text-[#9eb7a8] border-[#29382f]"
                >
                  {messages.filter((m) => m.type === "message").length} messages
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f]"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f]"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isSpecial = isSpecialMessage(msg.type);

                  return (
                    <div
                      key={msg.id}
                      className={`${isSpecial ? "text-center" : ""}`}
                    >
                      {isSpecial ? (
                        <div
                          className={`text-sm italic ${getMessageTypeColor(
                            msg.type
                          )}`}
                        >
                          <span className="bg-[#29382f] px-2 py-1 rounded-full">
                            {msg.message}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback className="bg-[#29382f] text-white text-xs">
                              {typeof msg.user === "string"
                                ? msg.user.slice(0, 2).toUpperCase()
                                : "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-sm font-medium ${
                                  msg.user === "You"
                                    ? "text-[#38e07b]"
                                    : "text-white"
                                }`}
                              >
                                {msg.user}
                              </span>
                              {msg.rating && (
                                <Badge
                                  variant="secondary"
                                  className="bg-[#29382f] text-[#9eb7a8] text-xs"
                                >
                                  {msg.rating}
                                </Badge>
                              )}
                              <span className="text-[#9eb7a8] text-xs">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <div className="text-[#9eb7a8] text-sm break-words">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-[#29382f]">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-[#29382f] border-[#3d5245] text-white placeholder:text-[#9eb7a8] flex-1"
                  maxLength={200}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f]"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-[#9eb7a8] mt-2">
                {newMessage.length}/200 characters
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moves" className="mt-4">
          <div className="bg-[#1c2620] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Move History</h3>
              <Badge
                variant="outline"
                className="text-[#9eb7a8] border-[#29382f]"
              >
                {currentGame?.moves?.length || 0} moves
              </Badge>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {!currentGame?.moves || currentGame.moves.length === 0 ? (
                  <div className="text-center text-[#9eb7a8] py-8">
                    No moves yet. Game will start soon!
                  </div>
                ) : (
                  // Display moves directly from the database
                  currentGame.moves.map((move, index) => (
                    <div
                      key={move._id || `move-${index}`}
                      className="flex items-center justify-between p-2 rounded bg-[#29382f] hover:bg-[#3d5245] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {move.white && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                          {move.black && (
                            <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-600" />
                          )}
                        </div>
                        <span className="text-white font-mono text-sm">
                          {move.moveNumber}. {move.white?.san || "--"} {move.black?.san || ""}
                        </span>
                      </div>
                      <span className="text-[#9eb7a8] text-xs">
                        {formatTime(new Date(move.black?.timestamp || move.white?.timestamp || new Date()))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="spectators" className="mt-4">
          <div className="bg-[#1c2620] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Players & Spectators</h3>
              <Badge
                variant="outline"
                className="text-[#9eb7a8] border-[#29382f]"
              >
                {2 + actualSpectators.length} total
              </Badge>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {/* Show Players First */}
                {currentGame?.players.white && (
                  <div className="flex items-center gap-3 p-2 rounded bg-[#29382f]">
                    <div className="w-3 h-3 rounded-full bg-white" />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white text-black text-xs">
                        {currentGame.players.white.username
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {currentGame.players.white.username}
                      </div>
                      <div className="text-[#9eb7a8] text-xs">
                        {currentGame.players.white.rating} rating • White
                      </div>
                    </div>
                  </div>
                )}

                {currentGame?.players.black && (
                  <div className="flex items-center gap-3 p-2 rounded bg-[#29382f]">
                    <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-600" />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        {currentGame.players.black.username
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {currentGame.players.black.username}
                      </div>
                      <div className="text-[#9eb7a8] text-xs">
                        {currentGame.players.black.rating} rating • Black
                      </div>
                    </div>
                  </div>
                )}

                {/* Show Spectators */}
                {actualSpectators.length > 0 && (
                  <>
                    <div className="border-t border-[#29382f] pt-3 mt-3">
                      <div className="text-[#9eb7a8] text-xs mb-2">
                        Spectators ({actualSpectators.length})
                      </div>
                    </div>
                    {actualSpectators.map((spectator) => (
                      <div
                        key={spectator.userId}
                        className="flex items-center gap-3 p-2 rounded hover:bg-[#29382f] transition-colors"
                      >
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#29382f] text-white text-xs">
                            {spectator.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">
                            {spectator.username}
                          </div>
                          <div className="text-[#9eb7a8] text-xs">
                            Spectator
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {actualSpectators.length === 0 && (
                  <div className="text-center text-[#9eb7a8] py-4">
                    No spectators watching
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
