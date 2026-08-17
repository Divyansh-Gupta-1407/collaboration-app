export interface PresenceInfo {
  userId: string;
  userName?: string;
  avatarUrl?: string;
  color: string;
  lastActive: number;
}

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FFB533'];

export class PresenceManager {
  private presenceMap: Map<string, Map<string, PresenceInfo>> = new Map();

  private getRandomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public addUser(documentId: string, userId: string, userName?: string, avatarUrl?: string): PresenceInfo {
    if (!this.presenceMap.has(documentId)) {
      this.presenceMap.set(documentId, new Map());
    }
    const docPresence = this.presenceMap.get(documentId)!;
    
    const color = this.getRandomColor();
    const info: PresenceInfo = {
      userId,
      userName,
      avatarUrl,
      color,
      lastActive: Date.now()
    };
    
    docPresence.set(userId, info);
    return info;
  }

  public removeUser(documentId: string, userId: string): void {
    const docPresence = this.presenceMap.get(documentId);
    if (docPresence) {
      docPresence.delete(userId);
      if (docPresence.size === 0) {
        this.presenceMap.delete(documentId);
      }
    }
  }

  public getPresence(documentId: string): PresenceInfo[] {
    const docPresence = this.presenceMap.get(documentId);
    if (!docPresence) return [];
    return Array.from(docPresence.values());
  }
}
