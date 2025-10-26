from datetime import datetime
from src.models.user import db

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    client = db.Column(db.String(200))
    description = db.Column(db.Text)
    business_area = db.Column(db.String(50), nullable=False)
    phase = db.Column(db.String(50), nullable=False)
    responsible = db.Column(db.String(100))
    deadline = db.Column(db.String(20))
    purchase_price = db.Column(db.Float, default=0.0)
    sale_price = db.Column(db.Float, default=0.0)
    markup_margin = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'client': self.client,
            'description': self.description,
            'businessArea': self.business_area,
            'phase': self.phase,
            'responsible': self.responsible,
            'deadline': self.deadline,
            'purchasePrice': self.purchase_price,
            'salePrice': self.sale_price,
            'markupMargin': self.markup_margin,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def from_dict(data):
        return Task(
            title=data.get('title'),
            client=data.get('client', ''),
            description=data.get('description', ''),
            business_area=data.get('businessArea'),
            phase=data.get('phase'),
            responsible=data.get('responsible', ''),
            deadline=data.get('deadline', ''),
            purchase_price=float(data.get('purchasePrice', 0)),
            sale_price=float(data.get('salePrice', 0)),
            markup_margin=float(data.get('markupMargin', 0))
        )
