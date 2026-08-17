export interface CursorPosition {
  x: number;
  y: number;
  // If editing text, might have index/length instead of x/y
  index?: number;
}

export class CursorManager {
  private cursors: Map<string, Map<string, CursorPosition>> = new Map();

  public updateCursor(documentId: string, userId: string, cursor: CursorPosition): void {
    if (!this.cursors.has(documentId)) {
      this.cursors.set(documentId, new Map());
    }
    const docCursors = this.cursors.get(documentId)!;
    docCursors.set(userId, cursor);
  }

  public getCursors(documentId: string): Record<string, CursorPosition> {
    const docCursors = this.cursors.get(documentId);
    if (!docCursors) return {};
    const result: Record<string, CursorPosition> = {};
    for (const [userId, cursor] of docCursors.entries()) {
      result[userId] = cursor;
    }
    return result;
  }

  public removeCursor(documentId: string, userId: string): void {
    const docCursors = this.cursors.get(documentId);
    if (docCursors) {
      docCursors.delete(userId);
      if (docCursors.size === 0) {
        this.cursors.delete(documentId);
      }
    }
  }
}
