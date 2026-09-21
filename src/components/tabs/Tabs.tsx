import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "./Tabs.css";

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

export type TabsSize = "sm" | "md";

export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  size?: TabsSize;
}

const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ size = "md", className, ...rest }, ref) => {
    const classes = ["q-tabs__list", `q-tabs__list--${size}`, className].filter(Boolean).join(" ");
    return <TabsPrimitive.List ref={ref} className={classes} {...rest} />;
  },
);

TabsList.displayName = "Tabs.List";

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-tabs__trigger", className].filter(Boolean).join(" ");
    return <TabsPrimitive.Trigger ref={ref} className={classes} {...rest} />;
  },
);

TabsTrigger.displayName = "Tabs.Trigger";

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-tabs__content", className].filter(Boolean).join(" ");
    return <TabsPrimitive.Content ref={ref} className={classes} {...rest} />;
  },
);

TabsContent.displayName = "Tabs.Content";

export const Tabs = Object.assign(TabsPrimitive.Root, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
