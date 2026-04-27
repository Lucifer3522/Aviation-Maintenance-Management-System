// Import Required Modules
import mongoose from 'mongoose';

// Import Task Schema
import taskSchema from '../schema/schema-task.js';

// Create and Export Task Model
const Task = mongoose.model('AMM-Task', taskSchema);

export default Task;
