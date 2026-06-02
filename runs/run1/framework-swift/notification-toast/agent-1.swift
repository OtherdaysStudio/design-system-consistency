import SwiftUI

// NotificationToast — elevated, horizontal toast notification.
// REUSES registered DS components only: DSStack, DSBadge, DSText, DSButton(.dsButtonStyle),
// .dsCard(.elevated). All values reference DS.* tokens. Variant is a Swift enum.

struct NotificationToast: View {

    // Variant as a Swift enum (no free parameters). Maps to a DSBadge tone.
    enum Tone {
        case success
        case warning
        case danger
        case info

        var badgeTone: DSBadge.Tone {
            switch self {
            case .success: return .success
            case .warning: return .warning
            case .danger:  return .danger
            case .info:    return .info
            }
        }
    }

    let tone: Tone
    let title: String
    let message: String
    let actionTitle: String
    let onAction: () -> Void

    init(
        tone: Tone = .success,
        title: String = "Saved",
        message: String = "Your changes were published.",
        actionTitle: String = "Undo",
        onAction: @escaping () -> Void = {}
    ) {
        self.tone = tone
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.onAction = onAction
    }

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            // Success badge/dot — reuse DSBadge at the variant's tone.
            DSBadge("", tone: tone.badgeTone)

            // Title + body, stacked. Type set ONLY via DSText presets.
            DSStack(.vertical, gap: .xs) {
                DSText(title, .title)
                DSText(message, .body, color: .dsTextSecondary)
            }

            // Ghost action on the right.
            DSButton(actionTitle, action: onAction)
                .dsButtonStyle(.ghost, .sm)
        }
        .dsCard(.elevated)
    }
}
