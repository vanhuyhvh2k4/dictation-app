import Topic from '../models/topic.js';
import { createTopicSchema, updateTopicSchema } from '../validators/topicSchema.js';

// Get all topics
export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      order: [['name', 'ASC']]
    });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get topic by ID
export const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: ['videos']
    });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new topic
export const createTopic = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createTopicSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check for duplicate slug
    const existingTopic = await Topic.findOne({ where: { name: value.name } });
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists' });
    }

    const topic = await Topic.create(value);
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update topic
export const updateTopic = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateTopicSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const topic = await Topic.findByPk(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check for duplicate slug if slug is being updated
    if (value.slug && value.slug !== topic.slug) {
      const existingTopic = await Topic.findOne({ where: { slug: value.name } });
      if (existingTopic) {
        return res.status(400).json({ message: 'Topic already exists' });
      }
    }

    await topic.update(value);
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete topic
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if topic has videos
    const videoCount = await topic.countVideos();
    if (videoCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete topic with associated videos. Please remove or reassign videos first.' 
      });
    }

    await topic.destroy();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};