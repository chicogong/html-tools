#!/usr/bin/env python3
"""
全面测试所有工具（新工具和老工具）
"""
import os
import re
from pathlib import Path
from collections import defaultdict

# 已迁移到 Glassmorphism 设计的工具列表
MIGRATED_TOOLS = [
    # P0 工具 (10)
    "tools/dev/jwt-decoder.html",
    "tools/dev/base64.html",
    "tools/dev/url-codec.html",
    "tools/dev/json-yaml.html",
    "tools/dev/clipboard-viewer.html",
    "tools/time/timestamp.html",
    "tools/time/timezone-converter.html",
    "tools/generator/uuid-generator.html",
    "tools/generator/qrcode-generator.html",
    "tools/generator/password-generator.html",
    # P1 工具 (11)
    "tools/text/markdown-preview.html",
    "tools/text/word-counter.html",
    "tools/text/case-converter.html",
    "tools/media/image-compressor.html",
    "tools/media/image-resize.html",
    "tools/media/svg-render.html",
    "tools/privacy/log-masker.html",
    "tools/privacy/file-hash.html",
    "tools/calculator/percentage-calculator.html",
    "tools/calculator/unit-converter.html",
    "tools/calculator/bmi-calculator.html",
    # P2 health 工具 (3)
    "tools/health/alcohol-metabolism.html",
    "tools/health/calorie-burn-calculator.html",
    "tools/health/calorie-calculator.html",
]

# Glassmorphism 设计系统检查项
GLASSMORPHISM_CHECKS = {
    "CSS变量-主色": r"--color-accent-primary:\s*#00d4aa",
    "CSS变量-玻璃模糊": r"--glass-blur:\s*24px",
    "CSS变量-玻璃饱和度": r"--glass-saturate:\s*180%",
    "字体-Inter": r"family=Inter",
    "字体-JetBrains": r"JetBrains\+Mono",
    "导航栏类": r'class=["\']nav-bar["\']',
    "主题图标类": r"theme-icon-(light|dark)",
    "面包屑Schema": r'"@type":\s*"BreadcrumbList"',
    "响应式-480px": r"@media[^}]*?480px",
    "响应式-768px": r"@media[^}]*?768px",
    "响应式-1024px": r"@media[^}]*?1024px",
    "Safe Area支持": r"env\(safe-area-inset",
}

# 基础 HTML 检查项（所有工具）
BASIC_HTML_CHECKS = {
    "HTML5文档类型": r"<!DOCTYPE html>",
    "html标签": r"<html[^>]*>",
    "head标签": r"<head>",
    "body标签": r"<body>",
    "charset声明": r'charset=["\']?utf-8["\']?',
    "viewport声明": r'name=["\']viewport["\']',
    "title标签": r"<title>.*?</title>",
}

# 常见问题检查项
COMMON_ISSUES = {
    "老式主色-刺眼青色": r"--accent-cyan:\s*#00f5d4",  # 应该已替换为 #00d4aa
    "老式字体-Space Grotesk": r"family=Space\+Grotesk",  # 应该已替换为 Inter
    "老式面包屑": r'class=["\']back-link["\']',  # 应该已替换为面包屑导航
    "缺失viewport-fit": r'viewport-fit=cover',  # 应该有此属性
}


def read_file_safe(file_path):
    """安全读取文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return None


def check_tool(file_path, is_migrated=False):
    """检查单个工具"""
    results = {
        'exists': False,
        'readable': False,
        'basic_html': {},
        'glassmorphism': {},
        'issues': {},
        'errors': []
    }

    # 检查文件是否存在
    if not os.path.exists(file_path):
        results['errors'].append(f"文件不存在: {file_path}")
        return results

    results['exists'] = True

    # 读取文件内容
    content = read_file_safe(file_path)
    if content is None:
        results['errors'].append(f"无法读取文件: {file_path}")
        return results

    results['readable'] = True

    # 基础 HTML 检查（所有工具）
    for check_name, pattern in BASIC_HTML_CHECKS.items():
        results['basic_html'][check_name] = bool(re.search(pattern, content, re.IGNORECASE))

    # 如果是已迁移的工具，进行 Glassmorphism 检查
    if is_migrated:
        for check_name, pattern in GLASSMORPHISM_CHECKS.items():
            results['glassmorphism'][check_name] = bool(re.search(pattern, content))

    # 常见问题检查
    for issue_name, pattern in COMMON_ISSUES.items():
        has_issue = bool(re.search(pattern, content))
        if issue_name == "缺失viewport-fit":
            # 这个是正向检查，有就是好的
            results['issues'][issue_name] = not has_issue  # True = 缺失（有问题）
        else:
            # 其他是负向检查，有就是坏的
            results['issues'][issue_name] = has_issue

    return results


def main():
    """主测试流程"""
    print("=" * 70)
    print("全面测试所有工具（新工具 + 老工具）")
    print("=" * 70)
    print()

    # 从 tools.json 读取所有工具路径
    import json
    with open('tools.json', 'r', encoding='utf-8') as f:
        tools_data = json.load(f)

    all_tools = [tool['path'] for tool in tools_data['tools'].values()]
    print(f"总工具数: {len(all_tools)}")
    print(f"已迁移工具数: {len(MIGRATED_TOOLS)}")
    print(f"老工具数: {len(all_tools) - len(MIGRATED_TOOLS)}")
    print()

    # 测试统计
    stats = {
        'migrated': {'total': 0, 'passed': 0, 'failed': 0},
        'legacy': {'total': 0, 'passed': 0, 'failed': 0},
        'all': {'total': 0, 'passed': 0, 'failed': 0}
    }

    # 问题汇总
    issues_summary = defaultdict(list)

    # 测试已迁移工具
    print("=" * 70)
    print("测试已迁移工具 (Glassmorphism 设计)")
    print("=" * 70)

    migrated_failures = []
    for tool_path in MIGRATED_TOOLS:
        stats['migrated']['total'] += 1
        stats['all']['total'] += 1

        results = check_tool(tool_path, is_migrated=True)

        # 检查是否通过
        passed = (
            results['exists'] and
            results['readable'] and
            all(results['basic_html'].values()) and
            all(results['glassmorphism'].values()) and
            not any(results['issues'].values())
        )

        if passed:
            stats['migrated']['passed'] += 1
            stats['all']['passed'] += 1
            print(f"✅ {tool_path}")
        else:
            stats['migrated']['failed'] += 1
            stats['all']['failed'] += 1
            migrated_failures.append((tool_path, results))
            print(f"❌ {tool_path}")

            # 记录具体问题
            if results['errors']:
                for error in results['errors']:
                    print(f"   错误: {error}")
                    issues_summary['文件错误'].append(f"{tool_path}: {error}")

            for check, passed_check in results['basic_html'].items():
                if not passed_check:
                    print(f"   缺失基础HTML: {check}")
                    issues_summary[f'基础HTML-{check}'].append(tool_path)

            for check, passed_check in results['glassmorphism'].items():
                if not passed_check:
                    print(f"   缺失Glassmorphism: {check}")
                    issues_summary[f'Glassmorphism-{check}'].append(tool_path)

            for issue, has_issue in results['issues'].items():
                if has_issue:
                    print(f"   问题: {issue}")
                    issues_summary[f'问题-{issue}'].append(tool_path)

    print()
    print("=" * 70)
    print("测试老工具 (基础检查)")
    print("=" * 70)

    legacy_tools = [t for t in all_tools if t not in MIGRATED_TOOLS]
    legacy_failures = []

    # 只显示前 20 个和最后的统计（避免输出过长）
    for i, tool_path in enumerate(legacy_tools):
        stats['legacy']['total'] += 1
        stats['all']['total'] += 1

        results = check_tool(tool_path, is_migrated=False)

        # 老工具只检查基础 HTML
        passed = (
            results['exists'] and
            results['readable'] and
            all(results['basic_html'].values())
        )

        if passed:
            stats['legacy']['passed'] += 1
            stats['all']['passed'] += 1
            if i < 20:  # 只显示前 20 个
                print(f"✅ {tool_path}")
        else:
            stats['legacy']['failed'] += 1
            stats['all']['failed'] += 1
            legacy_failures.append((tool_path, results))
            if i < 20:
                print(f"❌ {tool_path}")

                # 记录具体问题
                if results['errors']:
                    for error in results['errors']:
                        print(f"   错误: {error}")
                        issues_summary['文件错误'].append(f"{tool_path}: {error}")

                for check, passed_check in results['basic_html'].items():
                    if not passed_check:
                        print(f"   缺失基础HTML: {check}")
                        issues_summary[f'基础HTML-{check}'].append(tool_path)

    if len(legacy_tools) > 20:
        print(f"... (省略 {len(legacy_tools) - 20} 个老工具的详细输出)")

    print()
    print("=" * 70)
    print("测试总结")
    print("=" * 70)
    print()

    # 已迁移工具统计
    print("已迁移工具 (Glassmorphism):")
    print(f"  总计: {stats['migrated']['total']}")
    print(f"  通过: {stats['migrated']['passed']} ({stats['migrated']['passed']/stats['migrated']['total']*100:.1f}%)")
    print(f"  失败: {stats['migrated']['failed']} ({stats['migrated']['failed']/stats['migrated']['total']*100:.1f}%)")
    print()

    # 老工具统计
    print("老工具 (基础检查):")
    print(f"  总计: {stats['legacy']['total']}")
    print(f"  通过: {stats['legacy']['passed']} ({stats['legacy']['passed']/stats['legacy']['total']*100:.1f}%)")
    print(f"  失败: {stats['legacy']['failed']} ({stats['legacy']['failed']/stats['legacy']['total']*100:.1f}%)")
    print()

    # 总体统计
    print("总体:")
    print(f"  总计: {stats['all']['total']}")
    print(f"  通过: {stats['all']['passed']} ({stats['all']['passed']/stats['all']['total']*100:.1f}%)")
    print(f"  失败: {stats['all']['failed']} ({stats['all']['failed']/stats['all']['total']*100:.1f}%)")
    print()

    # 问题汇总
    if issues_summary:
        print("=" * 70)
        print("问题汇总（按类型分组）")
        print("=" * 70)
        print()

        for issue_type, tools in sorted(issues_summary.items()):
            print(f"{issue_type}: {len(tools)} 个工具")
            if len(tools) <= 10:
                for tool in tools:
                    print(f"  - {tool}")
            else:
                for tool in tools[:5]:
                    print(f"  - {tool}")
                print(f"  ... (还有 {len(tools) - 5} 个)")
            print()

    # 导出失败工具列表
    if migrated_failures or legacy_failures:
        with open('/tmp/failed_tools.txt', 'w', encoding='utf-8') as f:
            if migrated_failures:
                f.write("# 已迁移工具失败列表\n\n")
                for tool_path, results in migrated_failures:
                    f.write(f"{tool_path}\n")
                    if results['errors']:
                        for error in results['errors']:
                            f.write(f"  错误: {error}\n")
                    for check, passed_check in results['basic_html'].items():
                        if not passed_check:
                            f.write(f"  缺失基础HTML: {check}\n")
                    for check, passed_check in results['glassmorphism'].items():
                        if not passed_check:
                            f.write(f"  缺失Glassmorphism: {check}\n")
                    for issue, has_issue in results['issues'].items():
                        if has_issue:
                            f.write(f"  问题: {issue}\n")
                    f.write("\n")

            if legacy_failures:
                f.write("\n# 老工具失败列表\n\n")
                for tool_path, results in legacy_failures:
                    f.write(f"{tool_path}\n")
                    if results['errors']:
                        for error in results['errors']:
                            f.write(f"  错误: {error}\n")
                    for check, passed_check in results['basic_html'].items():
                        if not passed_check:
                            f.write(f"  缺失基础HTML: {check}\n")
                    f.write("\n")

        print(f"失败工具详情已导出到: /tmp/failed_tools.txt")

    print()
    print("测试完成！")

    # 返回退出码
    return 0 if stats['all']['failed'] == 0 else 1


if __name__ == '__main__':
    exit(main())
