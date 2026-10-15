import type { FormField, FieldOption } from '../../types/form'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Trash2, Plus, Settings } from 'lucide-react'
import { generateId } from '../../lib/id'

interface PropertiesPanelProps {
  selectedField: FormField | null
  onUpdateField: (updates: Partial<FormField>) => void
}

export function PropertiesPanel({ selectedField, onUpdateField }: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <div className='p-4 h-full flex items-center justify-center text-center'>
        <p className='text-[--color-text-muted] text-sm'>Select a field to edit its properties</p>
      </div>
    )
  }

  const updateValidation = (key: string, value: any) => {
    onUpdateField({
      validation: {
        ...(selectedField.validation || {}),
        [key]: value,
      },
    })
  }

  const addOption = () => {
    const newOption: FieldOption = {
      id: generateId(),
      label: `Option ${(selectedField.options?.length || 0) + 1}`,
      value: `option${(selectedField.options?.length || 0) + 1}`,
    }
    onUpdateField({
      options: [...(selectedField.options || []), newOption],
    })
  }

  const updateOption = (id: string, updates: Partial<FieldOption>) => {
    onUpdateField({
      options: selectedField.options?.map((opt) =>
        opt.id === id ? { ...opt, ...updates } : opt
      ),
    })
  }

  const deleteOption = (id: string) => {
    onUpdateField({
      options: selectedField.options?.filter((opt) => opt.id !== id),
    })
  }

  return (
    <div className='p-4 h-full overflow-y-auto'>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-[--color-text-muted]" />
        <h3 className='font-medium text-[--color-text]'>Field Properties</h3>
      </div>
      <div className='space-y-4'>
        <Input
          label='Field Label'
          value={selectedField.label}
          onChange={(e) => onUpdateField({ label: e.target.value })}
          required
        />
        <Input
          label='Placeholder'
          value={selectedField.placeholder || ''}
          onChange={(e) => onUpdateField({ placeholder: e.target.value })}
        />
        <Input
          label='Help Text'
          value={selectedField.helpText || ''}
          onChange={(e) => onUpdateField({ helpText: e.target.value })}
        />
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={selectedField.required || false}
            onChange={(e) => {
              onUpdateField({ required: e.target.checked })
              updateValidation('required', e.target.checked)
            }}
            className='w-4 h-4 rounded'
          />
          <span className='text-sm text-[--color-text]'>Required</span>
        </label>

        {(selectedField.type === 'select' || selectedField.type === 'radio') && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-[--color-text]'>Options</label>
            {selectedField.options?.map((option) => (
              <div key={option.id} className='flex items-center gap-2'>
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(option.id, { label: e.target.value })}
                  className='flex-1'
                  placeholder='Label'
                />
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(option.id, { value: e.target.value })}
                  className='flex-1'
                  placeholder='Value'
                />
                <Button variant='ghost' size='sm' onClick={() => deleteOption(option.id)}>
                  <Trash2 className='w-4 h-4 text-[--color-danger]' />
                </Button>
              </div>
            ))}
            <Button variant='secondary' size='sm' onClick={addOption} className='gap-1 w-full justify-center'>
              <Plus className='w-4 h-4' />
              Add Option
            </Button>
          </div>
        )}

        {(selectedField.type === 'text' || selectedField.type === 'password' || selectedField.type === 'textarea') && (
          <>
            <Input
              type='number'
              label='Min Length'
              value={selectedField.validation?.minLength ?? ''}
              onChange={(e) => updateValidation('minLength', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type='number'
              label='Max Length'
              value={selectedField.validation?.maxLength ?? ''}
              onChange={(e) => updateValidation('maxLength', e.target.value ? Number(e.target.value) : undefined)}
            />
          </>
        )}

        {selectedField.type === 'number' && (
          <>
            <Input
              type='number'
              label='Min Value'
              value={selectedField.validation?.min ?? ''}
              onChange={(e) => updateValidation('min', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type='number'
              label='Max Value'
              value={selectedField.validation?.max ?? ''}
              onChange={(e) => updateValidation('max', e.target.value ? Number(e.target.value) : undefined)}
            />
          </>
        )}

        {selectedField.type === 'date' && (
          <>
            <Input
              type='date'
              label='Min Date'
              value={selectedField.validation?.minDate ?? ''}
              onChange={(e) => updateValidation('minDate', e.target.value || undefined)}
            />
            <Input
              type='date'
              label='Max Date'
              value={selectedField.validation?.maxDate ?? ''}
              onChange={(e) => updateValidation('maxDate', e.target.value || undefined)}
            />
          </>
        )}
      </div>
    </div>
  )
}

