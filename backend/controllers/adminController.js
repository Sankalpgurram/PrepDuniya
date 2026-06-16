import { getAllQuestions, addQuestion, updateQuestion, deleteQuestion } from '../models/adminModel.js';

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await getAllQuestions();
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const insertId = await addQuestion(req.body);
    res.status(201).json({ success: true, message: 'Question added successfully', data: { id: insertId } });
  } catch (error) {
    next(error);
  }
};

export const editQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await updateQuestion(id, req.body);
    res.status(200).json({ success: true, message: 'Question updated successfully', data: null });
  } catch (error) {
    next(error);
  }
};

export const removeQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteQuestion(id);
    res.status(200).json({ success: true, message: 'Question deleted successfully', data: null });
  } catch (error) {
    next(error);
  }
};
