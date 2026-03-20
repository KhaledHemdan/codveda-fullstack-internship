const Project = require('../models/Project');
const User = require('../models/User');

const resolvers = {
  Query: {
    // Fetches the logged-in user's profile
    getMe: async (_, __, context) => {
      if (!context.user) throw new Error("Authentication Required");
      return await User.findById(context.user.id);
    },
    // Fetches all projects and populates the owner data
    getAllProjects: async () => {
      return await Project.find().populate('owner');
    },
  },

  Mutation: {
    createProject: async (_, { title, description }, context) => {
      if (!context.user) throw new Error("You must be logged in");
      const newProject = new Project({
        title,
        description,
        owner: context.user.id
      });
      return await newProject.save();
    },
    updateProjectStatus: async (_, { id, status }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return await Project.findByIdAndUpdate(id, { status }, { new: true });
    }
  },

  // Field Resolver: Fetch projects for a specific user only when requested
  User: {
    projects: async (parent) => {
      return await Project.find({ owner: parent.id });
    }
  }
};

module.exports = resolvers;