export interface MonicaPagination {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface MonicaListResponse<T> {
  data: T[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: MonicaPagination;
}

export interface MonicaSingleResponse<T> {
  data: T;
}

export interface MonicaDeleteResponse {
  deleted: boolean;
  id: number;
}

export interface Contact {
  id: number;
  object: "contact";
  hash_id?: string;
  first_name: string;
  last_name: string | null;
  nickname: string;
  complete_name?: string;
  initials?: string;
  gender: string | null;
  gender_type?: string | null;
  is_partial: boolean;
  is_dead: boolean;
  is_me?: boolean;
  last_called: string | null;
  last_activity_together: string | null;
  stay_in_touch_frequency: number | null;
  stay_in_touch_trigger_date: string | null;
  information: ContactInformation;
  addresses: Address[];
  tags: Tag[];
  statistics: ContactStatistics;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface ContactInformation {
  relationships: Record<string, { total: number; contacts: unknown[] }>;
  dates: {
    birthdate: SpecialDate | null;
    deceased_date: SpecialDate | null;
  };
  career: { job: string | null; company: string | null } | null;
  avatar: { url: string | null; source: string | null; default_avatar_color: string };
  food_preferencies: string | null;
  how_you_met: {
    general_information: string | null;
    first_met_date: SpecialDate | null;
    first_met_through_contact: { id: number; name: string } | null;
  } | null;
}

export interface SpecialDate {
  is_age_based: boolean;
  is_year_unknown: boolean;
  date: string | null;
}

export interface ContactStatistics {
  number_of_calls: number;
  number_of_notes: number;
  number_of_activities: number;
  number_of_reminders: number;
  number_of_tasks: number;
  number_of_gifts: number;
  number_of_debts: number;
}

export interface Activity {
  id: number;
  object: "activity";
  summary: string;
  description: string | null;
  happened_at: string;
  activity_type: ActivityType | null;
  attendees: { total: number; contacts: Partial<Contact>[] };
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface ActivityType {
  id: number;
  object: "activityType";
  name: string;
  location_type: string | null;
  activity_type_category: ActivityTypeCategory;
  account: { id: number };
  created_at: string | null;
  updated_at: string | null;
}

export interface ActivityTypeCategory {
  id: number;
  object: "activityTypeCategory";
  name: string;
  account: { id: number };
  created_at: string | null;
  updated_at: string | null;
}

export interface Address {
  id: number;
  object: "address";
  name: string;
  street: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: { id: string; object: "country"; name: string; iso: string };
  account: { id: number };
  contact?: Partial<Contact>;
  created_at: string | null;
  updated_at: string | null;
}

export interface Call {
  id: number;
  object: "call";
  called_at: string;
  content: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  object: "company";
  name: string;
  website: string | null;
  number_of_employees: number | null;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface ContactField {
  id: number;
  object: "contactfield";
  content: string;
  contact_field_type: ContactFieldType;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string | null;
  updated_at: string | null;
}

export interface ContactFieldType {
  id: number;
  object: "contactfieldtype";
  name: string;
  fontawesome_icon: string | null;
  protocol: string | null;
  delible: boolean;
  type: string;
  account: { id: number };
  created_at: string | null;
  updated_at: string | null;
}

export interface Conversation {
  id: number;
  object: "conversation";
  conversation_content: string;
  conversation_content_has_content: boolean;
  conversation_messages: ConversationMessage[];
  contact_field_type: ContactFieldType;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: number;
  object: "conversationMessage";
  content: string;
  written_at: string;
  written_by_me: boolean;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  object: "country";
  name: string;
  iso: string;
}

export interface Currency {
  id: number;
  object: "currency";
  name: string;
  iso: string;
  symbol: string;
}

export interface Debt {
  id: number;
  object: "debt";
  amount: number;
  in_debt: string;
  reason: string | null;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  object: "document";
  original_filename: string;
  new_filename: string;
  filesize: number;
  type: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Gender {
  id: number;
  object: "gender";
  name: string;
  type: string;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface Gift {
  id: number;
  object: "gift";
  name: string;
  comment: string | null;
  url: string | null;
  amount: number | null;
  amount_with_currency: string | null;
  status: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: number;
  object: "group";
  name: string;
  account: { id: number };
  contacts: Partial<Contact>[];
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: number;
  object: "journalEntry";
  title: string;
  post: string;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  object: "note";
  body: string;
  content?: string;
  is_favorited: boolean;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Occupation {
  id: number;
  object: "occupation";
  company: string;
  job: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: number;
  object: "photo";
  original_filename: string;
  new_filename: string;
  filesize: number;
  mime_type: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  id: number;
  object: "relationship";
  contact_is: string;
  relationship_type: RelationshipType;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface RelationshipType {
  id: number;
  object: "relationshipType";
  name: string;
  name_reverse_relationship: string;
  relationship_type_group: RelationshipTypeGroup;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface RelationshipTypeGroup {
  id: number;
  object: "relationshipTypeGroup";
  name: string;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: number;
  object: "reminder";
  title: string;
  description: string | null;
  frequency_type: string;
  frequency_number: number | null;
  initial_date: string;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  object: "tag";
  name: string;
  name_slug: string;
  description: string | null;
  account: { id: number };
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  object: "task";
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  account: { id: number };
  contact: Partial<Contact>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  object: "user";
  first_name: string;
  last_name: string;
  email: string;
  timezone: string | null;
  currency: string | null;
  locale: string;
  is_policy_compliant: boolean;
  account: { id: number };
  created_at: string;
  updated_at: string;
}