import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
  type: 'multiple',
});

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
}

export const Accordion = ({ type = 'multiple', defaultValue, className, children }: AccordionProps) => {
  const initial = defaultValue
    ? Array.isArray(defaultValue)
      ? defaultValue
      : [defaultValue]
    : [];
  const [openItems, setOpenItems] = useState<string[]>(initial);

  const toggle = (value: string) => {
    if (type === 'single') {
      setOpenItems(prev => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={cn('space-y-1', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isOpen: false,
});

interface AccordionItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export const AccordionItem = ({ value, className, children }: AccordionItemProps) => {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('border-b border-border', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

export const AccordionTrigger = ({ className, children }: AccordionTriggerProps) => {
  const { toggle } = useContext(AccordionContext);
  const { value, isOpen } = useContext(AccordionItemContext);

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
      />
    </button>
  );
};

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export const AccordionContent = ({ className, children }: AccordionContentProps) => {
  const { isOpen } = useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <div className={cn('pb-4 pt-0 text-sm', className)}>
      {children}
    </div>
  );
};
