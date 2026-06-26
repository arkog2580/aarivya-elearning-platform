# Database Schema - MongoDB Collections

## 1. Users Collection
- _id, name, email, passwordHash, role, interests, avatar, createdAt

## 2. Courses Collection
- _id, title, description, instructorId, category, level, lectures, status, enrolledCount

## 3. Progress Collection
- _id, studentId, courseId, completedLectures, progressPercent, quizScores, isCompleted, lastAccessed
