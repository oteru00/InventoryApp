import { TEXTS } from "../../../../const/texts"
import type { Marketplace, Status } from "./types"

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
    { value: "販売中", label: TEXTS.STATUS_SALE },
    { value: "売約済", label: TEXTS.STATUS_SOLD },
]

export const MARKET_OPTIONS: { value: Marketplace; label: string }[] = [
    { value: "mercari", label: TEXTS.MARKET_MERCARI },
    { value: "yahoo", label: TEXTS.MARKET_YAHOO },
    { value: "rakuma", label: TEXTS.MARKET_RAKUMA },
    { value: "instagram", label: TEXTS.MARKET_INSTAGRAM },
]

export const HAS_IMAGE_OPTIONS = [
    { value: "all", label: TEXTS.FILTER_ALL },
    { value: "yes", label: TEXTS.FILTER_IMAGE_YES },
    { value: "no", label: TEXTS.FILTER_IMAGE_NO },
] as const

export const DISCOUNTED_OPTIONS = [
    { value: "all", label: TEXTS.FILTER_ALL },
    { value: "yes", label: TEXTS.FILTER_DISCOUNT_YES },
    { value: "no", label: TEXTS.FILTER_DISCOUNT_NO },
] as const
