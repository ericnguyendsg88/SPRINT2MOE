/**
 * Account Type Utilities
 * 
 * Business Logic:
 * - Education Account (SC - Singapore Citizen): Has balance, can use combined payment methods, can receive top-ups
 * - Student Account (PR/Non-Resident): NO balance, must pay in full with single payment method, no top-ups
 */

export type AccountType = 'education' | 'student';
export type ResidentialStatus = 'sc' | 'pr' | 'non_resident';

/**
 * Determines account type based on residential status
 * SC (Singapore Citizen) -> Education Account
 * PR/Non-Resident -> Student Account
 */
export function getAccountTypeFromResidentialStatus(residentialStatus: ResidentialStatus): AccountType {
  return residentialStatus === 'sc' ? 'education' : 'student';
}

/**
 * Checks if account is an Education Account (has balance features)
 */
export function isEducationAccount(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): boolean {
  if (accountType) {
    return accountType === 'education';
  }
  // Fallback to residential status if account_type not available
  return residentialStatus === 'sc';
}

/**
 * Checks if account is a Student Account (no balance features)
 */
export function isStudentAccount(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): boolean {
  return !isEducationAccount(accountType, residentialStatus);
}

/**
 * Gets display label for account type
 */
export function getAccountTypeLabel(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): string {
  return isEducationAccount(accountType, residentialStatus) ? 'Education Account' : 'Student Account';
}

/**
 * Gets the information section title based on account type
 */
export function getAccountInfoTitle(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): string {
  return isEducationAccount(accountType, residentialStatus) 
    ? 'Education Account Information' 
    : 'Student Account Information';
}

/**
 * Checks if account can receive top-ups
 * Only Education Accounts can receive top-ups
 */
export function canReceiveTopUp(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): boolean {
  return isEducationAccount(accountType, residentialStatus);
}

/**
 * Checks if account can use balance for payment
 * Only Education Accounts have balance
 */
export function canUseBalance(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): boolean {
  return isEducationAccount(accountType, residentialStatus);
}

/**
 * Checks if account can use combined payment methods
 * Only Education Accounts can use combined payment (balance + external)
 */
export function canUseCombinedPayment(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): boolean {
  return isEducationAccount(accountType, residentialStatus);
}

/**
 * Gets badge variant for account type
 */
export function getAccountTypeBadgeVariant(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): 'default' | 'secondary' {
  return isEducationAccount(accountType, residentialStatus) ? 'default' : 'secondary';
}

/**
 * Account type badge color classes
 */
export function getAccountTypeBadgeClass(accountType: AccountType | undefined | null, residentialStatus?: ResidentialStatus): string {
  return isEducationAccount(accountType, residentialStatus) 
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
}
