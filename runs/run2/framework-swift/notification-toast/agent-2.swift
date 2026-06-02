import SwiftUI

/// A toast notification: a success badge/dot, a bold title with a body line,
/// and a ghost "Undo" action on the right. Elevated surface, horizontal layout.
///
/// DS reuse:
/// - Layout/spacing only through DSStack(gap:) — never .padding on a DSStack/dsCard container.
/// - Type only through DSText(_, .preset).
/// - DSBadge encodes the success status dot.
/// - DSButton + .dsButtonStyle(.ghost, .sm) encodes the Undo action.
/// - .dsCard(.elevated) owns inset, radius, and elevation.
struct NotificationToast: View {
    let title: String
    let message: String
    var onUndo: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            // Success status dot — most specific component is the success badge pill.
            DSBadge("", tone: .success)

            DSStack(.vertical, gap: .xs) {
                DSText(title, .title)
                DSText(message, .body, color: .dsTextSecondary)
            }

            DSButton("Undo", action: onUndo)
                .dsButtonStyle(.ghost, .sm)
        }
        .dsCard(.elevated)
    }
}

#Preview {
    NotificationToast(
        title: "Saved",
        message: "Your changes were published."
    ) {}
    .padding(DS.Spacing.lg)
    .background(Color.dsBgCanvas)
}
