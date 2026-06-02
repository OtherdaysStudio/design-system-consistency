// Aperture DS — DSText
// The only sanctioned way to set type. Renders a string at a registered
// typography preset via the generated `.dsType(_:)` modifier. Never set
// `.font(.system(size:))` directly.
//
// Usage: DSText("Title", .title)
//        DSText("Muted caption", .caption, color: .dsTextSecondary)
import SwiftUI

public struct DSText: View {
    private let content: String
    private let preset: DSTypePreset
    private let color: Color

    public init(
        _ content: String,
        _ preset: DSTypePreset = .body,
        color: Color = .dsTextPrimary
    ) {
        self.content = content
        self.preset = preset
        self.color = color
    }

    public var body: some View {
        Text(content)
            .dsType(preset)
            .foregroundStyle(color)
    }
}
