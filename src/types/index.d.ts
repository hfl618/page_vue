/**
 * @typedef {Object} Article
 * @property {string|number} id - Article unique identifier
 * @property {string} title - Article title
 * @property {string} [content] - Article markdown content
 * @property {string} [excerpt] - Short description
 * @property {string} visibility - 'public' | 'private'
 * @property {number} [is_public] - Legacy visibility flag (1 for public)
 * @property {string|number} user_id - Owner ID
 * @property {string|number} [parent_id] - Parent article/collection ID
 * @property {boolean} [is_collection] - Whether this is a collection of articles
 * @property {string} [updated_at] - ISO date string
 * @property {string} [created_at] - ISO date string
 * @property {boolean} [is_owner] - Calculated property for UI
 */

/**
 * @typedef {Object} UserProfile
 * @property {string|number} id
 * @property {string} username
 * @property {string} [avatar]
 * @property {string} [bio]
 * @property {boolean} [public_profile]
 */

export {}
