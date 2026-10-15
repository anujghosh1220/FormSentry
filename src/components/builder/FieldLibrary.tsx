import { 
  Type, Mail, Lock, Hash, FileText, List, CircleDot, CheckSquare, Calendar 
} from 'lucide-react'
import type { FieldType } from '../../types/form'
import { generateId } from '../../lib/id'

const fieldTypes: { type: FieldType; label: string; icon: any }[] = [
  { type: 'text', label: 'Short Text', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'password', label: 'Password', icon: Lock },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'textarea', label: 'Textarea', icon: FileText },
  { type: 'select', label: 'Dropdown/Select', icon: List },
  { type: 'radio', label: 'Radio Group', icon: CircleDot },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'date', label: 'Date', icon: Calendar },
]

interface FieldLibraryProps {
  onAddField: (field: any) => void
}

export function FieldLibrary({ onAddField }: FieldLibraryProps) {
  const handleAdd = (type: FieldType) => {
    const baseField = {
      id: generateId(),
      type,
      label: fieldTypes.find((f) => f.type === type)?.label || 'Field',
      required: false,
      order: 0,
    }

    const defaults: any = {}
    if (type === 'select' || type === 'radio') {
      defaults.options = [
        { id: generateId(), label: 'Option 1', value: 'option1' },
        { id: generateId(), label: 'Option 2', value: 'option2' },
      ]
    }
    if (type === 'checkbox') {
      defaults.required = false
    }

    onAddField({ ...baseField, ...defaults })
  }

  return (
    <div className='p-4 h-full overflow-y-auto'>
      <h3 className='font-medium text-[--color-text] mb-3'>Field Library</h3>
      <div className='space-y-2'>
        {fieldTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => handleAdd(type)}
            className='w-full flex items-center gap-2 p-2 bg-[--color-bg-secondary] border border-[--color-border] rounded-lg hover:border-[--color-primary] hover:bg-[--color-bg-surface] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] transition-colors text-left'
          >
            <Icon className='w-4 h-4 text-[--color-text-muted]' />
            <span className='text-sm text-[--color-text]'>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

