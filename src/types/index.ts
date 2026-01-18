// Shared TypeScript types for the application

import type {
  User,
  Brief,
  Club,
  Brand,
  Region,
  RequestTemplate,
  Approval,
  ProductionTask,
  Deliverable,
  Comment,
  Notification,
  AuditLog,
  UserClub,
} from '@prisma/client'

// ============== USER TYPES ==============

export type SafeUser = Omit<User, 'passwordHash'>

export type UserWithClubs = User & {
  clubs: (UserClub & {
    club: Club & {
      brand: Brand
      region: Region
    }
  })[]
}

// ============== BRIEF TYPES ==============

export type BriefWithRelations = Brief & {
  createdBy: SafeUser
  club: Club
  brand: Brand
  template: RequestTemplate
  approvals: (Approval & {
    validator: SafeUser
  })[]
  productionTask: ProductionTask | null
  comments: Comment[]
}

export type BriefListItem = Brief & {
  club: Club
  brand: Brand
  template: RequestTemplate
  productionTask: {
    status: string
  } | null
}

// ============== APPROVAL TYPES ==============

export type ApprovalWithValidator = Approval & {
  validator: SafeUser
}

export type BriefForApproval = Brief & {
  createdBy: SafeUser
  club: Club
  brand: Brand
  template: RequestTemplate
}

// ============== PRODUCTION TYPES ==============

export type TaskWithRelations = ProductionTask & {
  brief: Brief & {
    club: Club
    brand: Brand
    template: RequestTemplate
    createdBy: SafeUser
    approvals: ApprovalWithValidator[]
  }
  assignee: SafeUser | null
  deliverables: Deliverable[]
  comments: Comment[]
}

export type TaskListItem = ProductionTask & {
  brief: Brief & {
    club: Club
    brand: Brand
    template: RequestTemplate
    createdBy: SafeUser
  }
  assignee: SafeUser | null
  deliverables: Deliverable[]
}

// ============== NOTIFICATION TYPES ==============

export type NotificationWithRead = Notification & {
  isRead: boolean
}

// ============== AUDIT LOG TYPES ==============

export type AuditLogWithUser = AuditLog & {
  user: SafeUser
  brief: Brief | null
}

// ============== DASHBOARD TYPES ==============

export interface DashboardStats {
  totalBriefs: number
  draftBriefs: number
  submittedBriefs: number
  approvedBriefs: number
  pendingApprovals: number
  tasksInProgress: number
  deliveredTasks: number
  unreadNotifications: number
}

export interface ClubManagerDashboard extends DashboardStats {
  recentBriefs: BriefListItem[]
  notifications: Notification[]
}

export interface ValidatorDashboard extends DashboardStats {
  briefsForApproval: BriefForApproval[]
  recentApprovals: ApprovalWithValidator[]
}

export interface ProductionDashboard extends DashboardStats {
  taskQueue: TaskListItem[]
  myTasks: TaskListItem[]
}

// ============== FORM TYPES ==============

export interface BriefFormData {
  clubId: string
  brandId: string
  templateId: string
  title: string
  objective: string
  kpiDescription: string
  kpiTarget?: number
  deadline: Date
  startDate?: Date
  endDate?: Date
  context: string
  offerDetails?: string
  legalCopy?: string
  customFields: Record<string, unknown>
  assetLinks: string[]
}

export interface TemplateField {
  type: string
  title: string
  description?: string
  required?: boolean
  enum?: string[]
  enumNames?: string[]
  items?: {
    type: string
    enum?: string[]
    enumNames?: string[]
  }
  minItems?: number
  maxLength?: number
  default?: unknown
  format?: string
}

export interface TemplateSchema {
  type: 'object'
  required?: string[]
  properties: Record<string, TemplateField>
}

// ============== API RESPONSE TYPES ==============

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============== FILTER TYPES ==============

export interface BriefFilters {
  status?: string[]
  priority?: string[]
  clubId?: string
  brandId?: string
  templateId?: string
  createdById?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface TaskFilters {
  status?: string[]
  assigneeId?: string
  priority?: string[]
  dueDateFrom?: Date
  dueDateTo?: Date
}

// ============== UTILITY TYPES ==============

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
