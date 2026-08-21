import { useActiveCategory } from "@/hooks/useActiveCategory"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/types/domain"

export function CategorySwitcher({ className }: { className?: string }) {
  const { activeCategory, setActiveCategory, availableCategories } = useActiveCategory()

  if (availableCategories.length <= 1) return null

  return (
    <Select
      value={activeCategory}
      onValueChange={(v) => v && setActiveCategory(v as Category)}
    >
      <SelectTrigger className={className ?? "h-9 w-full"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableCategories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
