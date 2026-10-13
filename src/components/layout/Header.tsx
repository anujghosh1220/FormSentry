import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className='bg-white border-b border-[--color-border] shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center gap-2'>
          <Link to='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
            <div className='bg-[--color-primary] rounded-lg p-2'>
              <FileText className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-xl font-semibold text-[--color-text]'>FormSentry</h1>
          </Link>
        </div>
      </div>
    </header>
  )
}

