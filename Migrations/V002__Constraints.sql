-- Username can only contain alphabetic characters from any language 
-- and numbers, but no whitespaces, emojis, or special characters
ALTER TABLE users
ADD CONSTRAINT chk_username
CHECK (username ~ '^\p{L}[\p{L}\p{N}]*$');

-- Role names can only contain alphabetic characters and single spaces
-- but no leading, trailing, or consecutive spaces
ALTER TABLE roles
ADD CONSTRAINT chk_role_name
CHECK (role_name ~ '^[a-zA-Z]+( [a-zA-Z]+)*$');