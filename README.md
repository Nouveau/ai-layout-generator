# AI Layout Builder Module
Uses Drupal 10 Layout Builder, Patternkit, and AI modules to auto generate a layout based on a mockup


## Overview

The AI Layout Builder module programmatically constructs and applies Layout Builder layouts to new content nodes based on predefined or dynamically generated JSON structures. This is particularly useful for scenarios where layouts need to be standardized based on content type, AI-driven content generation workflows, or imported from external systems.

This module also automatically adds an "AI Prompt Image" field to the "Page" content type upon installation, intended for future use with AI services.

## Features

Automatically applies a Layout Builder layout to new nodes of a configured content type.
Supports placement of inline blocks.
Flexible JSON structure for defining sections, regions, components, and their configurations.
Automatically adds an "AI Prompt Image" field (machine name: field_ai_prompt_image) to the "Page" content type on module installation. This field allows PNG and JPG uploads and is configured with a required ALT text.


## Installation

Copy the ai_layout_builder directory to your Drupal installation's modules/custom directory.

Enable the module through the Drupal UI (Extend) or via Drush: drush en ai_layout_builder -y.

Upon installation, the "AI Prompt Image" field will be added to the "Page" content type. If the "Page" content type does not exist, or if the field already exists with the same name, installation might encounter issues.


## Configuration

Target Content Type for Layouts:

Open the ai_layout_builder.module file.
Locate the line: $targetContentType = 'page';
Change 'page' to the machine name of the content type you want the dynamic layouts to affect (e.g., 'article').
Note: The AI Prompt Image field is currently hardcoded to be added to the 'page' content type via configuration files.
If you need it on a different content type, you'll need to modify the config/install/field.field.node.page.field_ai_prompt_image.yml file accordingly before installation.

Layout Builder on Target Content Type:

Ensure that for the $targetContentType intended for dynamic layouts:
Layout Builder is enabled (Manage Display -> Use Layout Builder).
"Allow each content item to have its layout customized" is checked. This ensures the layout_builder__layout field is available.


Implement Data Source Function:

You MUST implement the logic within the _ai_layout_builder_get_layout_data_for_node(NodeInterface $node): array function in ai_layout_builder.module.
This function is responsible for returning the JSON-like array structure that defines the layout for the given node.

This data can come from:

A static JSON file packaged with your module (as currently implemented for demonstration).

Drupal configuration (e.g., config() system).

An external API call (intended future use with the 'ai' module).

Logic based on the node's properties.

The expected return structure is detailed in the PHPDoc block of the function.


## How it Works

The module implements hook_node_presave(). When a new node of the configured target content type is being saved for the first time:

It calls _ai_layout_builder_get_layout_data_for_node() to get the layout definition.

It then iterates through the "sections" and "components" (blocks) in the layout data.

It constructs Drupal\layout_builder\Section and Drupal\layout_builder\SectionComponent objects.

Finally, it sets these constructed sections onto the node's layout_builder__layout field, replacing any default layout.


## JSON Structure Reference (for Layouts)

Refer to the PHPDoc block in _ai_layout_builder_get_layout_data_for_node() for a detailed example of the expected JSON structure for defining layouts.
Key elements currently supported include:

sections: Array of section definitions.

layout_plugin_id: Machine name of the layout plugin (e.g., layout_onecol, layout_twocol_bricks).

layout_settings: Settings for the layout plugin.

components: Array of block definitions within the section.

type: Must be 'inline_block'.

region: Target region within the section layout.

plugin_id: The block plugin ID (e.g., system_main_block, views_block:my_view-block_1, patternkit_block:your_pattern_name).

configuration: An array of settings for the block plugin (e.g., label, label_display, context_mapping, plugin-specific settings).

weight (optional): Integer weight for ordering.

third_party_settings (optional): Settings for third-party modules.


## Important Notes

The layout building logic in this module currently acts on new nodes only. It does not modify existing node layouts.

The layout_builder__layout field on the node will be completely overwritten with the new layout. Any default layout configured for the content type will be replaced for nodes processed by this module.

Thoroughly test with your specific JSON structures and content types.
