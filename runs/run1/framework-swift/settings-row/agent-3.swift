import SwiftUI

// SettingsRow — a single settings list row built on registered Aperture DS components.
// REUSED: DSStack (layout/spacing), DSText (type), DSToggle (switch), .dsCard (surface).
// No raw literals: every value references DS.* / Color.ds* per the consistency framework.

struct SettingsRow: View {
    // Variants are Swift enums, not free parameters.
    enum Helper: Equatable {
        case none
        case text(String)
    }

    enum Surface: Equatable {
        case card
        case elevatedCard
    }

    let title: String
    let helper: Helper
    let surface: Surface
    @Binding var isOn: Bool

    init(
        _ title: String = "Push notifications",
        helper: Helper = .text("Get notified about activity"),
        surface: Surface = .card,
        isOn: Binding<Bool>
    ) {
        self.title = title
        self.helper = helper
        self.surface = surface
        self._isOn = isOn
    }

    var body: some View {
        DSStack(.horizontal, gap: .md) {
            // Left: label block.
            DSStack(.vertical, gap: .xs) {
                DSText(title, .body)

                if case let .text(helperText) = helper {
                    DSText(helperText, .caption, color: .dsTextSecondary)
                }
            }

            Spacer(minLength: DS.Spacing.md)

            // Right: switch, right-aligned.
            DSToggle("", isOn: $isOn)
                .labelsHidden()
        }
        .dsCard(surface == .card ? .default : .elevated)
    }
}

#Preview {
    StatefulPreviewWrapper(true) { binding in
        SettingsRow(isOn: binding)
            .padding(DS.Spacing.lg)
            .background(Color.dsBgCanvas)
    }
}

// Preview-only helper so the @Binding-driven row can be previewed in isolation.
private struct StatefulPreviewWrapper<Value, Content: View>: View {
    @State private var value: Value
    private let content: (Binding<Value>) -> Content

    init(_ initialValue: Value, @ViewBuilder content: @escaping (Binding<Value>) -> Content) {
        self._value = State(initialValue: initialValue)
        self.content = content
    }

    var body: some View { content($value) }
}
