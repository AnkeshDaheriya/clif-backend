const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const milestoneSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    goalAchievedBy: { type: Date, },
    milestones: {
        1: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        2: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        3: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        // Continue similarly for milestones '4' to '8' ...
        4: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        5: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        6: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        7: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
        8: {
            timeline: {
                startDate: { type: Date, },
                endDate: { type: Date, },
                durationMonths: { type: Number, },
            },
            focusArea: { type: String, },
            goal: { type: String, },
            keyActivities: [String],
            measurableOutcomes: [String],
            learningResources: {
                courses: [String],
                books: [String],
                tools: [String],
            },
            kpis: [String],
            jobRoleDevelopment: {
                role: { type: String, },
                responsibilities: [String],
            },
        },
    },
});

const Milestone = mongoose.model("Milestone", milestoneSchema);

module.exports = Milestone;