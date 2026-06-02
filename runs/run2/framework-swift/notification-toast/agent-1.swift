import SwiftUI

// Aperture DS — Toast notification.
// Reuses registered DS components only: DSStack, DSBadge, DSText, DSButton.
// Layout/spacing flows through DSStack(gap:); .dsCard(.elevated) owns insets,
// radius, and elevation. No raw literals, no hand-rolled native equivalents.

struct NotificationToast: View {
    enum Status {
        case success

        var badgeTone: DSBadgeTone {
            switch self {
            case .success: return .success
            }
        }

        var badgeLabel: String {
            switch self {
            case .success: return "•"
            }
        }
    }

    var status: Status = .success
    var title: String = "Saved"
    var message: String = "Your changes were published."
    var undoTitle: String = "Undo"
    var onUndo: () -> Void = {}

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSBadge(status.badgeLabel, tone: status.badgeTone)

            DSStack(.vertical, gap: .xs) {
                DSText(title, .label)
                DSText(message, .body, color: .dsTextSecondary)
            }

            DSButton(undoTitle, action: onUndo)
                .dsButtonStyle(.ghost, .sm)
        }
        .dsCard(.elevated)
    }
}
