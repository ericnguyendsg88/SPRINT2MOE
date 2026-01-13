export type InSchoolStatus = 'in_school' | 'not_in_school';
export type EducationLevel = 'primary' | 'secondary' | 'post_secondary' | 'tertiary' | 'postgraduate';
export type ContinuingLearningStatus = 'active' | 'inactive' | 'completed';

export interface AccountHolder {
  id: string;
  nric: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  residentialAddress: string;
  mailingAddress: string;
  balance: number;
  status: 'active' | 'inactive' | 'closed' | 'pending';
  inSchool: InSchoolStatus;
  educationLevel?: EducationLevel;
  continuingLearning?: ContinuingLearningStatus;
  createdAt: string;
  closedAt?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'top_up' | 'course_fee' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'biannually' | 'yearly';
export type PaymentType = 'one_time' | 'recurring';

export interface Course {
  id: string;
  name: string;
  provider: string;
  billingCycle: BillingCycle;
  fee: number;
  description?: string;
  status: 'active' | 'inactive';
}

export interface Enrollment {
  id: string;
  accountId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface TopUpRule {
  id: string;
  name: string;
  minAge?: number;
  maxAge?: number;
  minBalance?: number;
  maxBalance?: number;
  inSchool?: InSchoolStatus;
  educationLevel?: EducationLevel;
  continuingLearning?: ContinuingLearningStatus;
  amount: number;
  status: 'active' | 'inactive';
}

export type TopUpScheduleType = 'batch' | 'individual';
export type TopUpScheduleStatus = 'scheduled' | 'processing' | 'completed' | 'failed';

export interface TopUpSchedule {
  id: string;
  type: TopUpScheduleType;
  scheduledDate: string;
  scheduledTime?: string;
  executedDate?: string;
  status: TopUpScheduleStatus;
  amount: number;
  // For batch top-ups
  ruleId?: string;
  ruleName?: string;
  eligibleCount?: number;
  processedCount?: number;
  // For individual top-ups
  accountId?: string;
  accountName?: string;
  remarks?: string;
}

export interface CourseCharge {
  id: string;
  accountId: string;
  courseId: string;
  courseName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: 'account_balance' | 'credit_card' | 'paynow';
}
