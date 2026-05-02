import type { FB } from '../entities/fb.entity'
import { FBType } from '../enums'

export const isSellable    = (fb: FB): boolean => fb.type !== FBType.FRESH_RAW && fb.isVisible
export const isMenuVisible = (fb: FB): boolean => fb.type !== FBType.FRESH_RAW && fb.isVisible