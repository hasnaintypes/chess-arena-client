export interface ChessMove {
  id: string
  moveNumber: number
  white?: {
    move: string
    san: string
    from: string
    to: string
    piece: string
    captured?: string
    promotion?: string
    check?: boolean
    checkmate?: boolean
    timestamp: Date
  }
  black?: {
    move: string
    san: string
    from: string
    to: string
    piece: string
    captured?: string
    promotion?: string
    check?: boolean
    checkmate?: boolean
    timestamp: Date
  }
}

export interface GameRecord {
  id: string
  roomId: string
  players: {
    white: {
      id: string
      name: string
      rating: number
    }
    black: {
      id: string
      name: string
      rating: number
    }
  }
  gameInfo: {
    timeControl: string
    gameType: "casual" | "ranked" | "tournament"
    startTime: Date
    endTime?: Date
    result: "white-wins" | "black-wins" | "draw" | "ongoing"
    termination: "checkmate" | "resignation" | "timeout" | "draw-agreement" | "stalemate" | "ongoing"
  }
  moves: ChessMove[]
  finalPosition: string // FEN notation
}
