#!/bin/bash

# Fichier Markdown source
input_file="../../_posts/2025-01-23-15-criteria-recruitment-agencies-to-avoid.markdown"

# Fichier de sortie pour le tableau fusionné
output_file="evaluation-guide.md"

# Variables pour stocker l'en-tête unique et les lignes du tableau
header=""
rows=""
inside_table=false

# Lire le fichier ligne par ligne
while IFS= read -r line; do
    # Détecter les lignes de tableau
    if [[ $line == "|"* ]]; then
        if [[ $line == *"--"* ]]; then
            # Si une ligne de séparation est rencontrée, ne conserver qu'une seule fois l'en-tête
            if [[ -z $header ]]; then
                header=$line
            fi
        else
            # Ajouter les lignes de contenu au tableau fusionné
            rows+="$line"$'\n'
        fi
        inside_table=true
    else
        # Marquer la fin d'un tableau lorsque la ligne ne commence pas par "|"
        if [[ $inside_table == true ]]; then
            inside_table=false
        fi
    fi
done < "$input_file"

# Nettoyer les lignes inutiles et fusionner correctement
rows=$(echo "$rows" | awk '!seen[$0]++')

# Générer le tableau fusionné avec une seule en-tête
{
    echo "$header"
    echo "${header//[^|]/-}"  # Générer une ligne de séparation basée sur l'en-tête
    echo "$rows"
} > "$output_file"

echo "Tableau fusionné généré dans : $output_file"