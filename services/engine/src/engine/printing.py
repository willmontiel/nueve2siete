"""What the printer can make: the smallest feature and gap per nozzle on the Bambu Lab A1."""

from typing import Literal

Nozzle = Literal[0.4, 0.6, 0.8]

DEFAULT_NOZZLE: Nozzle = 0.4

# nozzle diameter (mm) -> (min feature, min gap) in mm, both in the XY plane of the logo face.
# Feature: 1.5 nozzle widths. Arachne prints it as one wide line or two thin ones; below that a shape
# becomes a single fragile bead, or nothing.
# Gap: 1.25 nozzle widths. The narrowest channel between two raised parts that doesn't close up with
# the extrusion width plus a little squish.
NOZZLE_LIMITS: dict[float, tuple[float, float]] = {
    0.4: (0.6, 0.5),
    0.6: (0.9, 0.75),
    0.8: (1.2, 1.0),
}
