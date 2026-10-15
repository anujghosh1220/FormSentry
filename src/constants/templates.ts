import type { FormDefinition } from '../types/form'
import { generateId } from '../lib/id'

export function createContactUsTemplate(): FormDefinition {
  const now = new Date().toISOString()
  const id = generateId()
  return {
    id,
    title: 'Contact Us',
    description: 'Send us a message and we will get back to you soon.',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
        order: 0,
        validation: { required: true, minLength: 2, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'email',
        label: 'Email',
        placeholder: 'john@example.com',
        required: true,
        order: 1,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'text',
        label: 'Subject',
        placeholder: 'How can we help?',
        required: true,
        order: 2,
        validation: { required: true, minLength: 3, maxLength: 150 },
      },
      {
        id: generateId(),
        type: 'textarea',
        label: 'Message',
        placeholder: 'Write your message here...',
        required: true,
        order: 3,
        validation: { required: true, minLength: 10, maxLength: 1000 },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}

export function createRegistrationTemplate(): FormDefinition {
  const now = new Date().toISOString()
  const id = generateId()
  return {
    id,
    title: 'Registration',
    description: 'Create a new account',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
        order: 0,
        validation: { required: true, minLength: 2, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'email',
        label: 'Email',
        placeholder: 'john@example.com',
        required: true,
        order: 1,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
        order: 2,
        validation: { required: true, minLength: 8, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'date',
        label: 'Date of Birth',
        required: true,
        order: 3,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'checkbox',
        label: 'I accept the terms and conditions',
        required: true,
        order: 4,
        validation: { required: true },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}

export function createFeedbackTemplate(): FormDefinition {
  const now = new Date().toISOString()
  const id = generateId()
  return {
    id,
    title: 'Feedback',
    description: 'We value your feedback',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'Name',
        placeholder: 'John Doe (optional)',
        required: false,
        order: 0,
        validation: { minLength: 2, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'radio',
        label: 'Rating',
        required: true,
        order: 1,
        options: [
          { id: generateId(), label: '5 - Excellent', value: '5' },
          { id: generateId(), label: '4 - Good', value: '4' },
          { id: generateId(), label: '3 - Average', value: '3' },
          { id: generateId(), label: '2 - Poor', value: '2' },
          { id: generateId(), label: '1 - Very Poor', value: '1' },
        ],
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'select',
        label: 'Category',
        required: true,
        order: 2,
        options: [
          { id: generateId(), label: 'Select a category', value: '' },
          { id: generateId(), label: 'Product', value: 'product' },
          { id: generateId(), label: 'Service', value: 'service' },
          { id: generateId(), label: 'Support', value: 'support' },
          { id: generateId(), label: 'Other', value: 'other' },
        ],
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'textarea',
        label: 'Feedback',
        placeholder: 'Share your thoughts...',
        required: true,
        order: 3,
        validation: { required: true, minLength: 5, maxLength: 1000 },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}


export function createJobApplicationTemplate(): FormDefinition {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'Job Application',
    description: 'Collect applications with resume details and consent.',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'Full Name',
        placeholder: 'Jane Doe',
        required: true,
        order: 0,
        validation: { required: true, minLength: 2, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'email',
        label: 'Email',
        placeholder: 'jane@example.com',
        required: true,
        order: 1,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'text',
        label: 'Portfolio URL',
        placeholder: 'https://',
        required: false,
        order: 2,
        validation: { pattern: '^https?://.+' },
      },
      {
        id: generateId(),
        type: 'select',
        label: 'Role',
        required: true,
        order: 3,
        options: [
          { id: generateId(), label: 'Select a role', value: '' },
          { id: generateId(), label: 'Frontend Engineer', value: 'frontend' },
          { id: generateId(), label: 'Backend Engineer', value: 'backend' },
          { id: generateId(), label: 'Designer', value: 'design' },
        ],
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'textarea',
        label: 'Why this role?',
        placeholder: 'Tell us what draws you here...',
        required: true,
        order: 4,
        validation: { required: true, minLength: 20, maxLength: 1200 },
      },
      {
        id: generateId(),
        type: 'checkbox',
        label: 'I consent to data processing',
        required: true,
        order: 5,
        validation: { required: true },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}

export function createEventRsvpTemplate(): FormDefinition {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'Event RSVP',
    description: 'Gather attendees, guests and dietary needs.',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'Name',
        placeholder: 'Your name',
        required: true,
        order: 0,
        validation: { required: true, minLength: 2, maxLength: 100 },
      },
      {
        id: generateId(),
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        required: true,
        order: 1,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'radio',
        label: 'Attending',
        required: true,
        order: 2,
        options: [
          { id: generateId(), label: 'Yes, I will be there', value: 'yes' },
          { id: generateId(), label: 'Sorry, I cannot make it', value: 'no' },
        ],
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'number',
        label: 'Number of guests',
        placeholder: '0',
        required: false,
        order: 3,
        validation: { min: 0, max: 5 },
      },
      {
        id: generateId(),
        type: 'date',
        label: 'Preferred date',
        required: false,
        order: 4,
      },
      {
        id: generateId(),
        type: 'textarea',
        label: 'Dietary requirements',
        placeholder: 'Allergies, preferences...',
        required: false,
        order: 5,
        validation: { maxLength: 400 },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}

export function createNewsletterTemplate(): FormDefinition {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'Newsletter Signup',
    description: 'A single-field opt-in with consent.',
    fields: [
      {
        id: generateId(),
        type: 'text',
        label: 'First name',
        placeholder: 'Alex',
        required: false,
        order: 0,
        validation: { maxLength: 60 },
      },
      {
        id: generateId(),
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        required: true,
        order: 1,
        validation: { required: true },
      },
      {
        id: generateId(),
        type: 'select',
        label: 'Interests',
        required: false,
        order: 2,
        options: [
          { id: generateId(), label: 'Everything', value: 'all' },
          { id: generateId(), label: 'Product updates', value: 'product' },
          { id: generateId(), label: 'Engineering', value: 'engineering' },
        ],
      },
      {
        id: generateId(),
        type: 'checkbox',
        label: 'Send me occasional emails',
        required: true,
        order: 3,
        validation: { required: true },
      },
    ],
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}