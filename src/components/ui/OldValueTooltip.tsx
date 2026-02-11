import { Tooltip, Typography } from "@mui/material";

type Props = {
  children: React.ReactNode;
  oldValue?: string | null;
};

/**
 * Wraps content for a changed cell: shows tooltip with previous value on hover.
 * When oldValue is not provided, renders children only.
 * No arrow or line on the tooltip.
 */
export function OldValueTooltip({ children, oldValue }: Props) {
  if (oldValue === undefined || oldValue === null) {
    return <>{children}</>;
  }
  const displayText =
    String(oldValue).trim() === "" ? "empty" : String(oldValue);
  return (
    <Tooltip
      title={
        <Typography variant="body2" fontWeight="bold" color="inherit">
          {displayText}
        </Typography>
      }
      placement="bottom"
      arrow={false}
      slotProps={{
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
          sx: {
            "& .MuiTooltip-tooltip": {
              bgcolor: "rgba(254, 226, 226, 1)",
              color: "black",
              border: "1px solid black",
            },
          },
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "inline-block",
          px: 0.75,
          py: 0.25,
          borderRadius: 10,
          bgcolor: "warning.light",
          border: "1px solid",
          borderColor: "warning.main",
          cursor: "default",
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  );
}
