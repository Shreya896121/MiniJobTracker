"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  enum JobType {
    INTERNSHIP
    FULL_TIME
    PART_TIME
  }

  enum ApplicationStatus {
    APPLIED
    INTERVIEWING
    OFFER
    REJECTED
  }

  type Application {
    id: ID!
    companyName: String!
    jobTitle: String!
    jobType: JobType!
    status: ApplicationStatus!
    appliedDate: String!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type PaginationMetadata {
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedApplications {
    applications: [Application!]!
    pagination: PaginationMetadata!
  }

  type Query {
    applications(
      status: ApplicationStatus
      search: String
      page: Int
      limit: Int
    ): PaginatedApplications!
    application(id: ID!): Application
  }

  type Mutation {
    createApplication(
      companyName: String!
      jobTitle: String!
      jobType: JobType!
      status: ApplicationStatus
      appliedDate: String!
      notes: String
    ): Application!

    updateApplication(
      id: ID!
      companyName: String
      jobTitle: String
      jobType: JobType
      status: ApplicationStatus
      appliedDate: String
      notes: String
    ): Application!

    deleteApplication(id: ID!): Boolean!
  }
`;
