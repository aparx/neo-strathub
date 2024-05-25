import { Button, Flexbox, Modal } from "@repo/ui/components";

export function SlotSwapModal({
  open,
  onOpenChange,
  onSwap,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onSwap: (mode: "stack" | "swap") => any;
}) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content style={{ maxWidth: 500 }} minWidth={375}>
        <Modal.Title>
          Swap slots' players?
          <Modal.Exit />
        </Modal.Title>
        You are about to change to a slot, that already has member(s) assigned.
        Do you want to swap the slots' players or stack them?
        <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
          <Modal.Close asChild>
            <Button onClick={() => onSwap("stack")}>Stack</Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button color={"cta"} onClick={() => onSwap("swap")}>
              Swap
            </Button>
          </Modal.Close>
        </Flexbox>
      </Modal.Content>
    </Modal.Root>
  );
}
