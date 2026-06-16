import { getNotificationsByUserId, createNotification, markAsRead, markAllAsRead } from '../models/notificationModel.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await getNotificationsByUserId(req.user.id);
    res.status(200).json({ success: true, message: 'Notifications fetched', data: notifications });
  } catch (error) {
    next(error);
  }
};

export const addNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;
    const insertId = await createNotification(userId, type, message);
    res.status(201).json({ success: true, message: 'Notification created', data: { id: insertId } });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await markAsRead(id, req.user.id);
    res.status(200).json({ success: true, message: 'Notification marked as read', data: null });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read', data: null });
  } catch (error) {
    next(error);
  }
};
