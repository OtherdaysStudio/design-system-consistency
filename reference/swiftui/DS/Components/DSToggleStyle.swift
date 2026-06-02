// Aperture DS — DSToggleStyle
// Binary on/off control with token-driven track/thumb colors. Apply to any
// SwiftUI Toggle via `.toggleStyle(DSToggleStyle())` or `.toggleStyle(.ds)`.
//
// Usage: Toggle("Wi-Fi", isOn: $on).toggleStyle(.ds)
import SwiftUI

public struct DSToggleStyle: ToggleStyle {
    // Track geometry derived from control-size tokens — no raw literals.
    private var trackHeight: CGFloat { DS.Size.controlSm }          // 32
    private var trackWidth: CGFloat { DS.Size.controlSm + DS.Spacing.md } // 48
    private var thumbInset: CGFloat { DS.Spacing.xs }              // 4
    private var thumbSize: CGFloat { trackHeight - DS.Spacing.sm } // 24

    public init() {}

    public func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: DS.Spacing.sm) {
            configuration.label
                .dsType(.label)                                   // type.label
                .foregroundStyle(Color.dsTextPrimary)

            Spacer(minLength: DS.Spacing.sm)

            ZStack(alignment: configuration.isOn ? .trailing : .leading) {
                Capsule()
                    .fill(configuration.isOn ? Color.dsActionPrimary : Color.dsBgMuted)
                    .frame(width: trackWidth, height: trackHeight)

                Circle()
                    .fill(Color.dsBgSurface)
                    .frame(width: thumbSize, height: thumbSize)
                    .padding(thumbInset)
                    .dsShadow(.sm)
            }
            .frame(width: trackWidth, height: trackHeight)
            .contentShape(Capsule())
            .onTapGesture {
                withAnimation(.easeInOut(duration: 0.18)) {
                    configuration.isOn.toggle()
                }
            }
        }
    }
}

public extension ToggleStyle where Self == DSToggleStyle {
    /// The Aperture toggle style.
    static var ds: DSToggleStyle { DSToggleStyle() }
}
