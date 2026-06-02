import SwiftUI

// NotificationToast — an elevated, horizontal success toast.
// Reuses registered DS components: DSStack, DSBadge, DSText, DSButton, .dsCard.
// All non-type/non-spacing values reference DS.* tokens. Variant is a Swift enum.
struct NotificationToast: View {

    // Variant is a Swift enum, not a free parameter.
    enum Tone {
        case success
        case info
        case warning
        case danger

        var badgeTone: DSBadge.Tone {
            switch self {
            case .success: return .success
            case .info:    return .info
            case .warning: return .warning
            case .danger:  return .danger
            }
        }
    }

    let title: String
    let message: String
    let tone: Tone
    var onUndo: () -> Void

    init(
        title: String = "Saved",
        message: String = "Your changes were published.",
        tone: Tone = .success,
        onUndo: @escaping () -> Void = {}
    ) {
        self.title = title
        self.message = message
        self.tone = tone
        self.onUndo = onUndo
    }

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            // Success badge/dot — registered status pill.
            DSBadge("", tone: tone.badgeTone)

            // Title + body stacked, spacing via DS token gap.
            DSStack(.vertical, gap: .xs) {
                DSText(title, .label)
                DSText(message, .body, color: .dsTextSecondary)
            }

            Spacer(minLength: DS.Spacing.sm)

            // Ghost action on the right — registered button + style.
            DSButton("Undo", action: onUndo)
                .dsButtonStyle(.ghost, .sm)
        }
        .dsCard(.elevated)
    }
}

#Preview {
    NotificationToast()
        .padding(DS.Spacing.lg)
        .background(Color.dsBgCanvas)
}
