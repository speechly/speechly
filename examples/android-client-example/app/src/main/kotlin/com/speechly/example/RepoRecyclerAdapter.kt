package com.speechly.example

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class RepoRecyclerAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    private var items: List<Repo> = ArrayList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RepoViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.repo,
                parent, false)
        return RepoViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        if (holder is RepoViewHolder) {
            holder.bind(items.get(position))
        }
    }

    override fun getItemCount() = items.size

    fun submitList(repoList: List<Repo>){
        items = repoList
    }

    class RepoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageView: ImageView = itemView.findViewById(R.id.imageView)
        val textView1: TextView = itemView.findViewById(R.id.textView1)
        val textView3: TextView = itemView.findViewById(R.id.textView3)
        val textView5: TextView = itemView.findViewById(R.id.textView5)
        val textView6: TextView = itemView.findViewById(R.id.textView6)
        val textView7: TextView = itemView.findViewById(R.id.textView7)

        fun bind(repo: Repo) {
            imageView.setImageResource(repo.iconId)
            textView1.text = repo.organisation
            textView3.text = repo.name
            textView5.text = formatNumber(repo.forks)
            textView6.text = formatNumber(repo.stars)
            textView7.text = formatNumber(repo.followers)
        }

        fun formatNumber(value: Int): String {
            if (value < 1000) {
                return value.toString()
            }

            if (value < 10000) {
                return "${(value / 1000.0).toString()}K"
            }

            return "${(value / 1000).toString()}K"
        }
    }
}