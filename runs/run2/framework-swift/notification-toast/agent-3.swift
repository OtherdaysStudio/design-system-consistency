// Aperture — NotificationToast
// A horizontal, elevated toast: success badge/dot, bold title + body copy,
// and a trailing ghost "Undo" action.
//
// Consistency notes (per Aperture DS Consistency framework):
//   • REUSE only — DSStack / DSBadge / DSText / DSButton + .dsCard / .dsButtonStyle.
//     Nothing styled is hand-rolled.
//   • Type is set ONLY through DSText (.title = semibold "bold" role, .body = copy).
//   • Spacing flows ONLY through DSStack(gap:); the elevated surface + inset come
//     from .dsCard(.elevated) (card.padding + shadow.md). No raw numbers appear in
//     any .padding/.frame/.cornerRadius position, and no raw Color / .font literals.
//   • Variants are DS enums: DSBadge.Tone.success, DSButtonStyle.Variant.ghost.
//   • Canonical path: the success indicator is the most specific registered
//     component (DSBadge), not a re-styled raw shape.
import SwiftUI

struct NotificationToast: View {
    var onUndo: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md, alignment: .center) {
            // Success badge/dot — most specific registered status component.
            DSBadge("✓", tone: .success)

            // Title + body copy block. Bold title via the .title preset (semibold).
            DSStack(.vertical, gap: .xs, alignment: .leading) {
                DSText("Saved", .title)
                DSText("Your changes were published.", .body, color: .dsTextSecondary)
            }

            Spacer(minLength: DS.Spacing.none)

            // Trailing ghost action.
            DSButton("Undo", action: onUndo)
                .dsButtonStyle(.ghost, .sm)
                .fixedSize()
        }
        .dsCard(.elevated)
    }
}

#Preview {
    NotificationToast()
        .padding(DS.Spacing.lg)
        .background(Color.dsBgCanvas)
}
