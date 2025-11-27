import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

import studentsRoutes from './routes/students.js';
import coursesRoutes from './routes/courses.js';
import enrollmentsRoutes from './routes/enrollments.js';

app.use('/students', studentsRoutes);
app.use('/enrollments', enrollmentsRoutes);
app.use('/courses', coursesRoutes);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});