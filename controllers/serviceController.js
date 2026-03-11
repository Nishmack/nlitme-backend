const Service = require('../models/Service');

const defaultServices = [
  { name: 'ADHD', description: 'Support and therapy for ADHD.' },
  { name: 'Anxiety', description: 'Therapy for anxiety and related disorders.' },
  { name: 'Depression', description: 'Support and treatment for depression.' },
  { name: 'Relationship Counseling', description: 'Therapy for relationships and couples.' }
];

const ensureDefaultServices = async () => {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(defaultServices);
  }
};

const getServices = async (req, res) => {
  await ensureDefaultServices();
  const services = await Service.find({ isActive: true }).sort({ name: 1 });
  res.json(services);
};

const createService = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Service name is required');
  }

  const existing = await Service.findOne({ name });

  if (existing) {
    res.status(400);
    throw new Error('Service with this name already exists');
  }

  const service = await Service.create({ name, description });

  res.status(201).json(service);
};

module.exports = {
  getServices,
  createService
};

