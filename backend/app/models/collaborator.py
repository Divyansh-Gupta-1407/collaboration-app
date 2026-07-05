from sqlalchemy import Column, Integer, String, ForeignKey
from ..database import Base

class DocumentCollaborator(Base):
    __tablename__ = "document_collaborators"

    document_id = Column(Integer, ForeignKey("documents.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(String(20), nullable=False)

