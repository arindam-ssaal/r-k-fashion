import { ReactNode } from 'react'

import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from './ui/tooltip'

function TootlTipWrapper({
  children,
  title = 'No title',
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default TootlTipWrapper
