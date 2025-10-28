import Menu from "@/assets/menu.svg";
import LocationInputCard from "@/components/common/card/location-input-card";
import { cn } from "@/lib/utils";
import { CoursePlaceProps } from "@/types/course";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ChangeOrderModeProps {
  fields: CoursePlaceProps[];
  onChangeReason: (index: number, reason: string) => void;
  remove: (index: number) => void;
  onReorder: (newOrder: CoursePlaceProps[]) => void;
}

interface SortableItemProps {
  place: CoursePlaceProps;
  index: number;
  onChangeReason: (index: number, reason: string) => void;
  remove: (index: number) => void;
}

const SortableItem = ({ place, index, onChangeReason, remove }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: place.placeName,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex select-none items-center gap-2.5 bg-white px-5 py-2.5 transition-opacity duration-200",
        isDragging && "opacity-50"
      )}
    >
      <div
        className="cursor-grab touch-none p-1 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Menu />
      </div>
      <LocationInputCard
        placeName={place.placeName}
        value={place.reason}
        onChange={(e) => onChangeReason(index, e.target.value)}
        placeholder="장소에 대해 설명해주세요"
        onRemove={() => remove(index)}
      />
    </div>
  );
};

export default function ChangeOrderMode({
  fields,
  onChangeReason,
  remove,
  onReorder,
}: ChangeOrderModeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.placeName === active.id);
      const newIndex = fields.findIndex((item) => item.placeName === over?.id);

      const newOrder = arrayMove(fields, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {fields.length > 0 ? (
        <SortableContext
          items={fields.map((item) => item.placeName)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((place, index) => (
            <SortableItem
              key={place.placeName}
              place={place}
              index={index}
              onChangeReason={onChangeReason}
              remove={remove}
            />
          ))}
        </SortableContext>
      ) : (
        <div className="my-3 flex flex-col items-center gap-2.5">
          <p className="text-6xl">🫥</p>
          <p className="typo-medium text-center text-gray-700">최소 3개의 장소를 추가해주세요</p>
        </div>
      )}
    </DndContext>
  );
}
