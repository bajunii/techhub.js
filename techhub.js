/**
 * Tech Innovation Hub Intern Management System
 * 
 * This system manages attachees (interns) across 4 divisions:
 * 1. Engineering
 * 2. Tech Programs
 * 3. Radio Support
 * 4. Hub Support
 * 
 * Features:
 * - Add/remove attachees to divisions
 * - Assign tasks to attachees
 * - Collect feedback and score performance
 * - View attachees by division with their performance
 */

class Attachee {
    /**
     * Represents an intern (attachee) in the tech hub
     * @param {string} name - Full name of the attachee
     * @param {string} email - Contact email
     * @param {string} division - One of the 4 hub divisions
     */
    constructor(name, email, division) {
        this.name = name;
        this.email = email;
        this.division = this.validateDivision(division);
        this.tasks = []; // Array to store assigned tasks
        this.feedback = []; // Array to store feedback entries
        this.performanceScore = 0; // Overall performance score (0-100)
    }

    /**
     * Validates that the division is one of the 4 valid options
     * @param {string} division 
     * @returns {string} validated division
     * @throws {Error} if division is invalid
     */
    validateDivision(division) {
        const validDivisions = ['Engineering', 'Tech Programs', 'Radio Support', 'Hub Support'];
        if (!validDivisions.includes(division)) {
            throw new Error(`Invalid division. Must be one of: ${validDivisions.join(', ')}`);
        }
        return division;
    }

    /**
     * Assigns a new task to the attachee
     * @param {string} taskDescription - Description of the task
     * @param {string} deadline - Due date for the task
     * @param {number} priority - Priority level (1-5, 5 being highest)
     */
    assignTask(taskDescription, deadline, priority) {
        const newTask = {
            id: this.tasks.length + 1,
            description: taskDescription,
            deadline: deadline,
            priority: priority,
            completed: false,
            completionDate: null
        };
        this.tasks.push(newTask);
    }

    /**
     * Marks a task as completed
     * @param {number} taskId - ID of the task to mark complete
     * @param {string} completionDate - Date when completed
     */
    completeTask(taskId, completionDate) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            task.completionDate = completionDate;
        }
    }

    /**
     * Adds feedback for the attachee and updates performance score
     * @param {string} feedbackText - The feedback content
     * @param {number} score - Performance score for this feedback (0-100)
     * @param {string} reviewer - Name of the supervisor providing feedback
     */
    addFeedback(feedbackText, score, reviewer) {
        this.feedback.push({
            text: feedbackText,
            score: score,
            reviewer: reviewer,
            date: new Date().toISOString()
        });
        this.calculatePerformanceScore();
    }

    /**
     * Calculates the overall performance score based on feedback
     */
    calculatePerformanceScore() {
        if (this.feedback.length === 0) return;
        
        const total = this.feedback.reduce((sum, entry) => sum + entry.score, 0);
        this.performanceScore = Math.round(total / this.feedback.length);
    }

    /**
     * Gets a summary of the attachee's performance
     * @returns {object} Performance summary
     */
    getPerformanceSummary() {
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const pendingTasks = this.tasks.length - completedTasks;
        
        return {
            name: this.name,
            division: this.division,
            performanceScore: this.performanceScore,
            tasksAssigned: this.tasks.length,
            tasksCompleted: completedTasks,
            tasksPending: pendingTasks,
            feedbackCount: this.feedback.length
        };
    }
}

class TaskManager {
    /**
     * Manages all attachees and their tasks across divisions
     */
    constructor() {
        this.attachees = [];
    }

    /**
     * Adds a new attachee to the system
     * @param {string} name 
     * @param {string} email 
     * @param {string} division 
     * @returns {Attachee} The newly created attachee
     */
    addAttachee(name, email, division) {
        const newAttachee = new Attachee(name, email, division);
        this.attachees.push(newAttachee);
        return newAttachee;
    }

    /**
     * Removes an attachee from the system
     * @param {string} email - Email of the attachee to remove
     */
    removeAttachee(email) {
        this.attachees = this.attachees.filter(a => a.email !== email);
    }

    /**
     * Gets all attachees in a specific division
     * @param {string} division 
     * @returns {Array} Array of attachees in the division
     */
    getAttacheesByDivision(division) {
        return this.attachees.filter(a => a.division === division);
    }

    /**
     * Assigns a task to all attachees in a division
     * @param {string} division 
     * @param {string} taskDescription 
     * @param {string} deadline 
     * @param {number} priority 
     */
    assignTaskToDivision(division, taskDescription, deadline, priority) {
        const divisionAttachees = this.getAttacheesByDivision(division);
        divisionAttachees.forEach(attachee => {
            attachee.assignTask(taskDescription, deadline, priority);
        });
    }

    /**
     * Assigns a task to a specific attachee
     * @param {string} email - Email of the attachee
     * @param {string} taskDescription 
     * @param {string} deadline 
     * @param {number} priority 
     */
    assignTaskToAttachee(email, taskDescription, deadline, priority) {
        const attachee = this.attachees.find(a => a.email === email);
        if (attachee) {
            attachee.assignTask(taskDescription, deadline, priority);
        }
    }

    /**
     * Adds feedback for a specific attachee
     * @param {string} email - Email of the attachee
     * @param {string} feedbackText 
     * @param {number} score 
     * @param {string} reviewer 
     */
    addFeedbackToAttachee(email, feedbackText, score, reviewer) {
        const attachee = this.attachees.find(a => a.email === email);
        if (attachee) {
            attachee.addFeedback(feedbackText, score, reviewer);
        }
    }

    /**
     * Generates a performance report for all attachees
     * @returns {object} Performance report by division
     */
    generatePerformanceReport() {
        const report = {
            Engineering: [],
            'Tech Programs': [],
            'Radio Support': [],
            'Hub Support': [],
            overallStats: {
                totalAttachees: this.attachees.length,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 100
            }
        };

        let totalScore = 0;
        let count = 0;

        this.attachees.forEach(attachee => {
            const summary = attachee.getPerformanceSummary();
            report[attachee.division].push(summary);

            // Update overall stats
            totalScore += summary.performanceScore;
            count++;
            
            if (summary.performanceScore > report.overallStats.highestScore) {
                report.overallStats.highestScore = summary.performanceScore;
            }
            
            if (summary.performanceScore < report.overallStats.lowestScore) {
                report.overallStats.lowestScore = summary.performanceScore;
            }
        });

        if (count > 0) {
            report.overallStats.averageScore = Math.round(totalScore / count);
        } else {
            report.overallStats.averageScore = 0;
            report.overallStats.highestScore = 0;
            report.overallStats.lowestScore = 0;
        }

        return report;
    }

    /**
     * Displays a formatted performance report in the console
     */
    displayPerformanceReport() {
        const report = this.generatePerformanceReport();
        
        console.log('\n=== TECH INNOVATION HUB PERFORMANCE REPORT ===\n');
        
        // Display by division
        for (const division in report) {
            if (division === 'overallStats') continue;
            
            const attachees = report[division];
            if (attachees.length > 0) {
                console.log(`\n--- ${division.toUpperCase()} DIVISION (${attachees.length} attachees) ---`);
                
                attachees.forEach(attachee => {
                    console.log(`\nName: ${attachee.name}`);
                    console.log(`Performance Score: ${attachee.performanceScore}/100`);
                    console.log(`Tasks: ${attachee.tasksCompleted}/${attachee.tasksAssigned} completed`);
                    console.log(`Feedback Entries: ${attachee.feedbackCount}`);
                });
            }
        }
        
        // Display overall stats
        console.log('\n=== OVERALL STATISTICS ===');
        console.log(`Total Attachees: ${report.overallStats.totalAttachees}`);
        console.log(`Average Performance Score: ${report.overallStats.averageScore}`);
        console.log(`Highest Score: ${report.overallStats.highestScore}`);
        console.log(`Lowest Score: ${report.overallStats.lowestScore}`);
    }
}

// Example Usage
const hubManager = new TaskManager();

// Adding attachees to different divisions
hubManager.addAttachee('Omar Haitham', 'omarhaitham@example.com', 'Engineering');
hubManager.addAttachee('Martin John', 'martin@example.com', 'Engineering');
hubManager.addAttachee('Mary Brown', 'maryb@example.com', 'Tech Programs');
hubManager.addAttachee('Diana Charles', 'diana@example.com', 'Radio Support');
hubManager.addAttachee('Cynthia Adams', 'cyadams@example.com', 'Hub Support');

// Assigning tasks
hubManager.assignTaskToDivision('Engineering', 'Develop API endpoint for user management', '2023-06-15', 4);
hubManager.assignTaskToAttachee('omarhaitham@example.com', 'Review code quality standards', '2023-06-10', 3);
hubManager.assignTaskToAttachee('martin@example.com', 'Optimize database queries', '2023-06-12', 5);

// Marking tasks as complete
const omarhaitham = hubManager.attachees.find(a => a.email === 'omarhaitham@example.com');
if (omarhaitham) {
    omarhaitham.completeTask(1, '2023-06-08');
    omarhaitham.completeTask(2, '2023-06-09');
}

// Adding feedback
hubManager.addFeedbackToAttachee('omarhaitham@example.com', 'Excellent work on the API development!', 95, 'Supervisor A');
hubManager.addFeedbackToAttachee('martin@example.com', 'Good progress, needs more attention to detail', 82, 'Supervisor B');
hubManager.addFeedbackToAttachee('maryb@example.com', 'Outstanding contribution to the tech program', 98, 'Supervisor C');

// Display performance report
hubManager.displayPerformanceReport();