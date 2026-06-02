import SwiftUI

/// A success toast notification on an elevated surface, laid out horizontally:
/// a success badge/dot, a bold "Saved" title with a supporting body line, and a
/// trailing ghost "Undo" action.
struct NotificationToast: View {
    enum Status {
        case success

        var tone: DSBadge.Tone {
            switch self {
            case .success: return .success
            }
        }

        var label: String {
            switch self {
            case .success: return "Saved"
            }
        }
    }

    let status: Status
    let title: String
    let message: String
    var onUndo: () -> Void

    init(
        status: Status = .success,
        title: String = "Saved",
        message: String = "Your changes were published.",
        onUndo: @escaping () -> Void
    ) {
        self.status = status
        self.title = title
        self.message = message
        self.onUndo = onUndo
    }

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            DSBadge(status.label, tone: status.tone)

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
