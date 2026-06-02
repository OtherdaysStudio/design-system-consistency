import SwiftUI

// Aperture DS — Notification toast.
// Mode B (govern new code): reuses only registered DS components —
// DSStack, DSBadge, DSText, DSButton — and routes every value through a token.
// Canonical paths: spacing via DSStack(gap:); type only via DSText; the
// elevated surface (inset + radius + shadow.md) via .dsCard(.elevated). The
// status dot is the most specific registered component (DSBadge), not a
// hand-rolled Circle. No raw literals, no native VStack/HStack/Button clones.

struct NotificationToast: View {
    /// Toast status. Variant is a Swift enum, never a free parameter.
    enum Status {
        case success

        var badgeTone: DSBadge.Tone {
            switch self {
            case .success: return .success
            }
        }

        /// Dot glyph rendered inside the status badge.
        var dot: String {
            switch self {
            case .success: return "●"
            }
        }
    }

    var status: Status = .success
    var title: String = "Saved"
    var message: String = "Your changes were published."
    var undoTitle: String = "Undo"
    var onUndo: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md, alignment: .center) {
            // Success badge / dot — most specific registered status component.
            DSBadge(status.dot, tone: status.badgeTone)

            // Title + body, stacked; gap is a DS.Spacing token via DSStack.
            DSStack(.vertical, gap: .xs, alignment: .leading) {
                DSText(title, .label)
                DSText(message, .body, color: .dsTextSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Ghost action on the right.
            DSButton(undoTitle, action: onUndo)
                .dsButtonStyle(.ghost, .sm)
                .fixedSize()
        }
        .dsCard(.elevated)
    }
}
