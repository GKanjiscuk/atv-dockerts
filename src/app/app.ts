import express, { Request, Response } from 'express'; // <-- Ajuste aqui
import mongoose, { Schema, Document } from 'mongoose';
import { Item } from '../model/item';
import { ItemInterface } from '../interface/ItemInterface';

const app = express();

app.use(express.json());

const mongoURI = process.env.MONGO_URI as string;

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

const ItemSchema = new Schema<ItemInterface>({
  nome: { type: String, required: true },
  descricao: { type: String, required: true }
});


const ItemModel = mongoose.model<ItemInterface>('Item', ItemSchema);

app.post('/items', async (req: Request, res: Response) => {
  try {
    const novoItem = new ItemModel(req.body);
    await novoItem.save();
    res.status(201).json(novoItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await ItemModel.find();
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/items/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/items/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const itemAtualizado = await ItemModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    
    if (!itemAtualizado) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    res.status(200).json(itemAtualizado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/items/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const itemDeletado = await ItemModel.findByIdAndDelete(req.params.id);
    
    if (!itemDeletado) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }
    res.status(200).json({ message: 'Item deletado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});