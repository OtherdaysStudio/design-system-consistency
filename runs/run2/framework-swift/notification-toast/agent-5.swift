import SwiftUI

/// A success toast notification.
///
/// Layout (horizontal, elevated surface):
///   [success dot] [ Saved / Your changes were published. ] [ Undo ghost ]
///
/// Built entirely from Aperture DS components:
///   - Surface ......... `.dsCard(.elevated)`         (token inset, radius, shadow.md)
///   - Layout/spacing .. `DSStack(gap:)`              (only sanctioned spacing path)
///   - Type ............ `DSText`                     (only sanctioned typography path)
///   - Action .......... `DSButton` + `.dsButtonStyle(.ghost, .sm)`
///   - Success dot ..... token-driven `Circle` (DSBadge needs a label; a pure
///                       indicator dot has none, so a sized/colored Circle is the
///                       most specific token-compliant primitive for it).
///
/// Every value references DS.* / Color.ds* — no raw numbers, no raw colors.
struct NotificationToast: View {
    /// Variant for the toast's status accent. Enum, never a free parameter.
    enum Status {
        case success

        var dotColor: Color {
            switch self {
            case .success: return .dsStatusSuccess
            }
        }
    }

    private let status: Status
    private let onUndo: () -> Void

    init(status: Status = .success, onUndo: @escaping () -> Void = {}) {
        self.status = status
        self.onUndo = onUndo
    }

    var body: some View {
        DSStack(.horizontal, gap: .md, alignment: .center) {
            // Success badge/dot — token-sized, token-colored.
            Circle()
                .fill(status.dotColor)
                .frame(width: DS.Size.iconSm, height: DS.Size.iconSm)

            // Title + body, left-aligned, tight gap.
            DSStack(.vertical, gap: .xs, alignment: .leading) {
                DSText("Saved", .label)
                DSText("Your changes were published.", .body, color: .dsTextSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Ghost action on the right; small size so it sits inline.
            DSButton("Undo", action: onUndo)
                .dsButtonStyle(.ghost, .sm)
                .fixedSize()
        }
        .dsCard(.elevated)
    }
}
