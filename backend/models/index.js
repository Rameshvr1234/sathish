const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User')(sequelize, DataTypes);
const Branch = require('./Branch')(sequelize, DataTypes);
const Property = require('./Property')(sequelize, DataTypes);
const PropertyImage = require('./PropertyImage')(sequelize, DataTypes);
const Approval = require('./Approval')(sequelize, DataTypes);
const ServiceBooking = require('./ServiceBooking')(sequelize, DataTypes);
const SurveyBooking = require('./SurveyBooking')(sequelize, DataTypes);
const LegalBooking = require('./LegalBooking')(sequelize, DataTypes);
const ConstructionBooking = require('./ConstructionBooking')(sequelize, DataTypes);
const FinanceBooking = require('./FinanceBooking')(sequelize, DataTypes);
const Payment = require('./Payment')(sequelize, DataTypes);
const Lead = require('./Lead')(sequelize, DataTypes);
const SiteVisit = require('./SiteVisit')(sequelize, DataTypes);
const Chat = require('./Chat')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);
const OfferNews = require('./OfferNews')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);
const PropertyAlert = require('./PropertyAlert')(sequelize, DataTypes);
const Builder = require('./Builder')(sequelize, DataTypes);
const Project = require('./Project')(sequelize, DataTypes);
const PremiumMembership = require('./PremiumMembership')(sequelize, DataTypes);
const RecentlyViewed = require('./RecentlyViewed');
const Shortlist = require('./Shortlist');
const LocalityInsights = require('./LocalityInsights');

// Phase 8 Models
const VirtualTour = require('./VirtualTour')(sequelize, DataTypes);
const VideoCallTour = require('./VideoCallTour')(sequelize, DataTypes);
const AIRecommendation = require('./AIRecommendation')(sequelize, DataTypes);
const HomeLoanApplication = require('./HomeLoanApplication')(sequelize, DataTypes);
const PropertyAnalytics = require('./PropertyAnalytics')(sequelize, DataTypes);

// Define associations

// User associations
User.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
Branch.hasMany(User, { foreignKey: 'branch_id', as: 'users' });

// Property associations
Property.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
Property.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
Property.hasMany(PropertyImage, { foreignKey: 'property_id', as: 'images' });
Property.hasMany(Approval, { foreignKey: 'property_id', as: 'approvals' });
Property.hasMany(Lead, { foreignKey: 'property_id', as: 'leads' });

User.hasMany(Property, { foreignKey: 'user_id', as: 'properties' });
Branch.hasMany(Property, { foreignKey: 'branch_id', as: 'properties' });

// PropertyImage associations
PropertyImage.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

// Approval associations
Approval.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Approval.belongsTo(User, { foreignKey: 'approver_id', as: 'approver' });

// Service Booking associations
ServiceBooking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ServiceBooking.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
ServiceBooking.hasOne(SurveyBooking, { foreignKey: 'booking_id', as: 'surveyDetails' });
ServiceBooking.hasOne(LegalBooking, { foreignKey: 'booking_id', as: 'legalDetails' });
ServiceBooking.hasOne(ConstructionBooking, { foreignKey: 'booking_id', as: 'constructionDetails' });
ServiceBooking.hasOne(FinanceBooking, { foreignKey: 'booking_id', as: 'financeDetails' });
ServiceBooking.hasOne(Payment, { foreignKey: 'booking_id', as: 'payment' });

User.hasMany(ServiceBooking, { foreignKey: 'user_id', as: 'serviceBookings' });
Branch.hasMany(ServiceBooking, { foreignKey: 'branch_id', as: 'serviceBookings' });

// Survey Booking associations
SurveyBooking.belongsTo(ServiceBooking, { foreignKey: 'booking_id', as: 'booking' });

// Legal Booking associations
LegalBooking.belongsTo(ServiceBooking, { foreignKey: 'booking_id', as: 'booking' });

// Construction Booking associations
ConstructionBooking.belongsTo(ServiceBooking, { foreignKey: 'booking_id', as: 'booking' });

// Finance Booking associations
FinanceBooking.belongsTo(ServiceBooking, { foreignKey: 'booking_id', as: 'booking' });

// Payment associations
Payment.belongsTo(ServiceBooking, { foreignKey: 'booking_id', as: 'booking' });
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Lead associations
Lead.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Lead.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Lead.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
Lead.hasMany(SiteVisit, { foreignKey: 'lead_id', as: 'siteVisits' });

User.hasMany(Lead, { foreignKey: 'user_id', as: 'userLeads' });
Branch.hasMany(Lead, { foreignKey: 'branch_id', as: 'branchLeads' });

// Site Visit associations
SiteVisit.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
SiteVisit.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
SiteVisit.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Property.hasMany(SiteVisit, { foreignKey: 'property_id', as: 'siteVisits' });
User.hasMany(SiteVisit, { foreignKey: 'user_id', as: 'siteVisits' });

// Chat associations
Chat.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });
Chat.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });
Chat.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });

User.hasMany(Chat, { foreignKey: 'user1_id', as: 'chatsAsUser1' });
User.hasMany(Chat, { foreignKey: 'user2_id', as: 'chatsAsUser2' });

// Message associations
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });

// Offer/News associations
OfferNews.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Review associations
Review.belongsTo(User, { foreignKey: 'user_id', as: 'reviewer' });
Review.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Property.hasMany(Review, { foreignKey: 'property_id', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

// PropertyAlert associations
PropertyAlert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PropertyAlert, { foreignKey: 'user_id', as: 'propertyAlerts' });

// Builder associations
Builder.hasMany(Project, { foreignKey: 'builder_id', as: 'projects' });
Builder.hasMany(Review, { foreignKey: 'builder_id', as: 'reviews' });

// Project associations
Project.belongsTo(Builder, { foreignKey: 'builder_id', as: 'builder' });
Project.hasMany(Property, { foreignKey: 'project_id', as: 'properties' });
Project.hasMany(Review, { foreignKey: 'property_id', as: 'reviews' });

// PremiumMembership associations
PremiumMembership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PremiumMembership, { foreignKey: 'user_id', as: 'memberships' });

// RecentlyViewed associations
RecentlyViewed.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
RecentlyViewed.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
User.hasMany(RecentlyViewed, { foreignKey: 'user_id', as: 'recentlyViewed' });
Property.hasMany(RecentlyViewed, { foreignKey: 'property_id', as: 'views' });

// Shortlist associations
Shortlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Shortlist.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
User.hasMany(Shortlist, { foreignKey: 'user_id', as: 'shortlist' });
Property.hasMany(Shortlist, { foreignKey: 'property_id', as: 'shortlists' });

// Phase 8 Associations

// VirtualTour associations
VirtualTour.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Property.hasMany(VirtualTour, { foreignKey: 'property_id', as: 'virtualTours' });

// VideoCallTour associations
VideoCallTour.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
VideoCallTour.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
VideoCallTour.belongsTo(User, { foreignKey: 'agent_id', as: 'agent' });
Property.hasMany(VideoCallTour, { foreignKey: 'property_id', as: 'videoCallTours' });
User.hasMany(VideoCallTour, { foreignKey: 'user_id', as: 'videoCallTours' });

// AIRecommendation associations
AIRecommendation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AIRecommendation.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
User.hasMany(AIRecommendation, { foreignKey: 'user_id', as: 'recommendations' });
Property.hasMany(AIRecommendation, { foreignKey: 'property_id', as: 'recommendations' });

// HomeLoanApplication associations
HomeLoanApplication.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
HomeLoanApplication.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
User.hasMany(HomeLoanApplication, { foreignKey: 'user_id', as: 'loanApplications' });
Property.hasMany(HomeLoanApplication, { foreignKey: 'property_id', as: 'loanApplications' });

// PropertyAnalytics associations
PropertyAnalytics.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });
Property.hasMany(PropertyAnalytics, { foreignKey: 'property_id', as: 'analytics' });

module.exports = {
  sequelize,
  User,
  Branch,
  Property,
  PropertyImage,
  Approval,
  ServiceBooking,
  SurveyBooking,
  LegalBooking,
  ConstructionBooking,
  FinanceBooking,
  Payment,
  Lead,
  SiteVisit,
  Chat,
  Message,
  OfferNews,
  Review,
  PropertyAlert,
  Builder,
  Project,
  PremiumMembership,
  RecentlyViewed,
  Shortlist,
  LocalityInsights,
  // Phase 8 Models
  VirtualTour,
  VideoCallTour,
  AIRecommendation,
  HomeLoanApplication,
  PropertyAnalytics
};
